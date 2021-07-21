import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk'

@Controller('upload')
export class UploadController {
    constructor( private readonly configService: ConfigService ) {}

    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        AWS.config.update({
            credentials: {
                accessKeyId: this.configService.get('AWS_KEY'),
                secretAccessKey: this.configService.get('AWS_SECRET'),
            },
        });
        const BUCKET_NAME = this.configService.get('BUCKET_NAME')

        try {
            const objectName = `${Date.now() + file.originalname}`;
            await new AWS.S3()
                .putObject({
                    Body: file.buffer,
                    Bucket: BUCKET_NAME,
                    Key: objectName,
                    ACL: 'public-read',
                })
                .promise();
            const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
            return { url };
            } catch (e) {
            return null;
        }
    }
}
