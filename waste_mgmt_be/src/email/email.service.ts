import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      // Example using Gmail
      service: 'gmail',
      auth: {
        user: this.config.get('EMAIL'),
        pass: this.config.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: this.config.get('EMAIL'), // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: html, // HTML body content
    };

    await this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred', error);
        throw error;
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  generateEmailBody(
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    date: string,
    threshold: number,
    amount: number,
  ) {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Threshold Alert</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                font-size: 20px;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 20px;
            }
            .highlight {
                color: #007bff; /* Blue */
            }
            .footer {
                font-size: 12px;
                color: #888;
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Customer Threshold Alert</div>
            <div class="content">
                Hello Admin,
                <br><br>
                This is to notify you that customer <span class="highlight">${customerName}</span> has exceeded the <span class="highlight">${threshold}%</span> threshold of their limit. The current total stands at <span class="highlight">${amount} %</span>.
                <br><br>
                <strong>Details:</strong>
                <ul>
                    <li>Email: <span class="highlight">${customerEmail}</span></li>
                    <li>Phone: <span class="highlight">${customerPhone}</span></li>
                    <li>Exceeded On: <span class="highlight">${date}</span></li>
                </ul>
                <br>
                Please take the necessary actions as per the company's policy for customers exceeding this threshold.
            </div>
            <div class="footer">
                This is an automated message, please do not reply directly to this email.
            </div>
        </div>
    </body>
    </html>
    `;

    return html;
  }
}
