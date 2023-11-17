# openoj-frontend

## 全局变量配置

`src/assets/global.json`文件为全局变量文件，部署前需要按照需求修改。各参数说明如下：

```json
{
  "ojName": "实例的名称，一般无需修改",
  "localStoragePrefix": "一般无需修改",
  "backendUrl": "后端的url链接，包含协议头、ip或域名、端口号（如果不是默认），例如：http://localhost:3000"
}
```

## 项目部署

nodejs LTS版本20

### 安装依赖

```sh
npm install
```

### 开发环境运行

```sh
npm run dev
```

### 生产环境打包

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
