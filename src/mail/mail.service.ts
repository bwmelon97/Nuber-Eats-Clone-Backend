import { Inject, Injectable } from '@nestjs/common';
import got from 'got'
import * as FormData from 'form-data';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Injectable()
export class MailService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: MailOptions
    ) {}

    /**
     * Nomad Coders 우버이츠 클론 코딩 강의 #6.7 까지 구현한 상태
     */
    private async sendEmail (subject: string, content:string) {
        
        const { apiKey, domain } = this.options;
        const form = new FormData();
        form.append('from', `Excited User <mailgun@${domain}>`);
        form.append('to', 'bwmelon97@naver.com');
        form.append('subject', subject);
        form.append('text', content);
        
        try {
            await got(
                `https://api.mailgun.net/v3/${domain}/messages`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `api:${apiKey}`
                        ).toString('base64')}`
                    },
                    body: form
                }
            )
        } catch (error) {
            console.log(error.message)
        }
    }
}
