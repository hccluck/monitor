import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import serve from 'koa-static';

import path from 'path';
const __dirname = path.resolve();

const app = new Koa();
const router = new Router();

router.get('/img.gif', async (ctx) => {
  console.log('image', ctx.request.query);
  console.log(ctx.request.body);
  ctx.body = {
    success: true
  };
});

router.post('/img.gif', async (ctx) => {
  console.log('beacon', ctx.request.query);
  console.log(ctx.request.body);
  ctx.body = JSON.stringify(ctx.request.body);
});

app
  .use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    // 设置允许跨域
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
    await next();
  })
  .use(koaBody({ multipart: true }))
  .use(router.routes())
  .use(serve(path.join(__dirname + '/server/html')))
  .use(serve(path.join(__dirname + '/src'), { extensions: ['.js'] }))
  .use(serve(path.join(__dirname + '/lib'), { extensions: ['.js'] }))
  .use(async (ctx) => {
    console.log('Not Found !!!', ctx.request.url);
  });

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT} ……`);
});

app.on('error', () => {
  console.log('Server is should be restart!!!');
});
