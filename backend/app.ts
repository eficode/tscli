import Koa from 'koa';
import send from 'koa-send';
import session from 'koa-session';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

import { Server } from 'socket.io';

import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:8000/login'
);

const CONFIG = {
  key: 'app.session',
  maxAge: 86400000,
  signed: false,
};

const app = new Koa();
const io = new Server();

app.keys = ['secret'];

app.use(bodyParser());
app.use(session(CONFIG, app));

const googleAuth = async (ctx) => {
  const { code, state } = ctx.query;

  if (!code || !state) {
    await send(ctx, '404.html');
    throw new Error('data missing');
  }

  const authResponse = await oauth2Client.getToken(code);

  // console.log(authResponse);

  ctx.session.user = state;

  io.to(state).emit('token', ctx.cookies.get('app.session'));

  await send(ctx, 'index.html');
};

app.use(async (ctx, next) => {
  const { state } = ctx.query;

  try {
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = err.statusCode || err.status || 500;
    await send(ctx, '404.html');

    if (state) {
      io.to(state).emit('error', err);
    }
  }
});

const publicRouter = new Router();
publicRouter.get('/login', googleAuth);

app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());

const requireSession = async (ctx, next) => {
  if (!ctx.session.user) {
    throw new Error('user missing');
  }
  await next();
};

const privateRouter = new Router();

privateRouter.use(requireSession);

privateRouter.get('/', (ctx, next) => {
  ctx.body = { data: { user: ctx.session.user }};
});

app.use(privateRouter.routes());
app.use(privateRouter.allowedMethods());

const server = app.listen(process.env.PORT || 8000);

io.attach(server);
