export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  saltOrRounds: 10,
  secret: process.env.SECRET_KEY,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  mail_host: process.env.MAIL_HOST,
  mail_port: process.env.MAIL_PORT,
  mail_user: process.env.MAIL_USER,
  mail_pass: process.env.MAIL_PASS,
});