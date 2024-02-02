import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  const config = new DocumentBuilder().addBearerAuth()
  .setTitle('Protaskapi')
  .setDescription(`
  The Protaskapi API description: 
  Protask is a dynamic and engaging task management system designed to turn your daily to-dos into a rewarding and motivational experience. Unlike traditional task management tools, TaskRewards adds a layer of gamification, allowing users to not only accomplish their tasks but also earn and redeem exciting rewards within the 
  `)
  .setVersion('1.0')
  .addTag('Protaskapi')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
bootstrap();
