const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://statuesque-toffee-f52484.netlify.app',
        'https://*.netlify.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Office 365 SMTP 配置 - 修正這裡！
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // 使用 STARTTLS
    auth: {
        user: process.env.GMAIL_USER || '11056046@ntub.edu.tw',
        pass: process.env.GMAIL_APP_PASSWORD || 'owym cjvw hsct jarf'
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    debug: true,
    logger: true
});

// 測試郵件連接
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ 郵件伺服器連接失敗:', error);
    } else {
        console.log('✅ 郵件伺服器連接成功，準備發送郵件');
        
        // 測試發送一封郵件
        const testMail = {
            from: '11056046@ntub.edu.tw',
            to: '11056046@ntub.edu.tw',
            subject: '📧 北商熱音社郵件服務測試',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #3b82f6;">北商熱音社郵件服務測試</h2>
                    <p>這是一封測試郵件，表示您的郵件服務已正常運作！</p>
                    <p>時間：${new Date().toLocaleString('zh-TW')}</p>
                </div>
            `
        };
        
        transporter.sendMail(testMail, (err, info) => {
            if (err) {
                console.log('❌ 測試郵件發送失敗:', err);
            } else {
                console.log('✅ 測試郵件發送成功:', info.response);
            }
        });
    }
});

// 其餘的程式碼保持不變...

// 郵件模板函數（保持不變）
function generateEmailContent(type, notification_type, data) {
    // ... 您原有的郵件模板程式碼保持不變
    let subject = '';
    let html = '';

    const baseHeader = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
            <div style="background: #3b82f6; color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0 0 5px 0;">北商熱音社練團室系統</h2>
                <p style="margin: 0; opacity: 0.9;">${type === 'admin' ? '管理員通知' : '用戶通知'}</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 0 0 8px 8px;">
    `;

    const baseFooter = `
                <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 0.9rem;">
                    <p>此為系統自動發送郵件，請勿直接回覆</p>
                    <p>北商熱音社練團室預約系統</p>
                </div>
            </div>
        </div>
    `;

    const websiteUrl = 'https://statuesque-toffee-f52484.netlify.app/';
    const adminUrl = 'https://statuesque-toffee-f52484.netlify.app/';

    if (type === 'admin') {
        if (notification_type === 'user_registration') {
            subject = `【新用戶註冊】${data.real_name} 已完成註冊`;
            html = baseHeader + `
                <div style="display: inline-block; padding: 6px 12px; background: #f1f5f9; border-radius: 6px; font-size: 0.85rem; margin-bottom: 15px; font-weight: 500;">新用戶註冊通知</div>
                <h3 style="color: #1e293b; margin-bottom: 15px;">有新用戶完成註冊</h3>
                <p>請前往管理後台審核用戶資料：</p>
                
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0;">
                    <h4 style="color: #3b82f6; margin-bottom: 10px;">用戶資訊</h4>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">姓名：</div>
                        <div style="flex: 1;">${data.real_name}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">學號：</div>
                        <div style="flex: 1;">${data.student_id}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">電子郵件：</div>
                        <div style="flex: 1;">${data.user_email}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">電話：</div>
                        <div style="flex: 1;">${data.phone}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">註冊時間：</div>
                        <div style="flex: 1;">${data.timestamp}</div>
                    </div>
                </div>
                
                <div style="background: rgba(59, 130, 246, 0.1); padding: 15px; border-radius: 6px; margin: 15px 0;">
                    <strong>請注意：</strong>新用戶需要通過審核才能使用預約功能。
                </div>
                
                <a href="${adminUrl}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: 600;">前往管理後台</a>
            ` + baseFooter;
        } else if (notification_type === 'new_booking') {
            subject = `【新預約通知】${data.real_name} 預約了練團室`;
            html = baseHeader + `
                <div style="display: inline-block; padding: 6px 12px; background: #f1f5f9; border-radius: 6px; font-size: 0.85rem; margin-bottom: 15px; font-weight: 500;">新預約通知</div>
                <h3 style="color: #1e293b; margin-bottom: 15px;">有新的練團室預約</h3>
                <p>請前往管理後台查看詳細資訊：</p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3b82f6;">
                    <h4 style="color: #3b82f6; margin-bottom: 10px;">預約詳情</h4>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">預約人：</div>
                        <div style="flex: 1;">${data.real_name} (${data.user_email})</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">日期：</div>
                        <div style="flex: 1;">${data.booking_date}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">時間：</div>
                        <div style="flex: 1;">${data.booking_time}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">類型：</div>
                        <div style="flex: 1;">${data.booking_type}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">名稱：</div>
                        <div style="flex: 1;">${data.booking_name}</div>
                    </div>
                    ${data.booking_notes && data.booking_notes !== '無' ? `
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">備註：</div>
                        <div style="flex: 1;">${data.booking_notes}</div>
                    </div>
                    ` : ''}
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">預約時間：</div>
                        <div style="flex: 1;">${data.timestamp}</div>
                    </div>
                </div>
                
                <a href="${adminUrl}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: 600;">前往管理後台</a>
            ` + baseFooter;
        }
    } else if (type === 'user') {
        if (notification_type === 'approval_result') {
            subject = `【帳號審核通知】${data.real_name} - 北商熱音社`;
            const statusText = data.approval_status === 'approved' ? '已通過' : '未通過';
            const statusStyle = data.approval_status === 'approved' ? 
                'background: rgba(16, 185, 129, 0.1); color: #10b981; border-left: 4px solid #10b981;' : 
                'background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-left: 4px solid #f59e0b;';
            
            html = baseHeader + `
                <div style="display: inline-block; padding: 6px 12px; background: #f1f5f9; border-radius: 6px; font-size: 0.85rem; margin-bottom: 15px; font-weight: 500;">帳號審核通知</div>
                <h3 style="color: #1e293b; margin-bottom: 15px;">帳號審核結果</h3>
                <p>親愛的 ${data.real_name} 同學：</p>
                
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0;">
                    <div style="${statusStyle} padding: 15px; border-radius: 6px; margin: 15px 0;">
                        <p style="margin: 0 0 10px 0;"><strong>您的帳號審核結果：${statusText}</strong></p>
                        ${data.approval_status === 'approved' ? 
                            `<p style="margin: 0 0 10px 0;">恭喜！您的北商熱音社練團室預約系統帳號已通過審核。</p>
                             <p style="margin: 0;"><strong>請重新登入系統以啟用預約功能。</strong></p>` : 
                            `<p style="margin: 0;">很抱歉，您的帳號審核未通過。</p>
                             ${data.admin_notes ? `<p style="margin: 10px 0 0 0;"><strong>原因：</strong>${data.admin_notes}</p>` : ''}
                             <p style="margin: 10px 0 0 0;">如有疑問，請聯繫管理員。</p>`
                        }
                    </div>
                    
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">姓名：</div>
                        <div style="flex: 1;">${data.real_name}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">學號：</div>
                        <div style="flex: 1;">${data.student_id}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">審核時間：</div>
                        <div style="flex: 1;">${data.timestamp}</div>
                    </div>
                </div>
                
                ${data.approval_status === 'approved' ? `
                <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #10b981;">
                    <p style="margin: 0 0 10px 0;"><strong>重要提醒：</strong></p>
                    <p style="margin: 0 0 5px 0;">✓ 請重新登入系統以啟用預約功能</p>
                    <p style="margin: 0 0 5px 0;">✓ 登入後即可開始預約練團室時段</p>
                    <p style="margin: 0;">✓ 如有任何問題，請聯繫管理員</p>
                </div>
                
                <a href="${websiteUrl}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: 600;">重新登入系統</a>
                ` : ''}
            ` + baseFooter;
        } else if (notification_type === 'booking_confirmation') {
            subject = `【預約成功】${data.booking_date} ${data.booking_time} - ${data.booking_name}`;
            html = baseHeader + `
                <div style="display: inline-block; padding: 6px 12px; background: #f1f5f9; border-radius: 6px; font-size: 0.85rem; margin-bottom: 15px; font-weight: 500;">預約確認通知</div>
                <h3 style="color: #1e293b; margin-bottom: 15px;">預約成功！</h3>
                <p>親愛的 ${data.real_name} 同學：</p>
                <p>您的練團室預約已成功，以下是預約詳情：</p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #10b981;">
                    <h4 style="color: #3b82f6; margin-bottom: 10px;">預約資訊</h4>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">日期：</div>
                        <div style="flex: 1;">${data.booking_date}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">時間：</div>
                        <div style="flex: 1;">${data.booking_time}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">類型：</div>
                        <div style="flex: 1;">${data.booking_type}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">名稱：</div>
                        <div style="flex: 1;">${data.booking_name}</div>
                    </div>
                    ${data.booking_notes && data.booking_notes !== '無' ? `
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">備註：</div>
                        <div style="flex: 1;">${data.booking_notes}</div>
                    </div>
                    ` : ''}
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">預約編號：</div>
                        <div style="flex: 1;">${data.booking_id}</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div style="font-weight: 600; width: 120px; color: #64748b;">確認時間：</div>
                        <div style="flex: 1;">${data.timestamp}</div>
                    </div>
                </div>
                
                <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #10b981;">
                    <p style="margin: 0;"><strong>請注意：</strong>請準時到達練團室，如有變動請提前取消預約。</p>
                </div>
                
                <a href="${websiteUrl}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: 600;">查看我的預約</a>
            ` + baseFooter;
        }
    }

    return { subject, html };
}

// 郵件發送 API
app.post('/api/send-email', async (req, res) => {
    try {
        const { to, type, notification_type, data } = req.body;

        console.log('📧 收到郵件發送請求:', { 
            to, 
            type, 
            notification_type,
            timestamp: new Date().toISOString()
        });

        // 生成郵件內容
        const emailContent = generateEmailContent(type, notification_type, data);
        
        console.log('📝 郵件內容生成完成，收件人:', to);

        const mailOptions = {
            from: '11056046@ntub.edu.tw',
            to: to,
            subject: emailContent.subject,
            html: emailContent.html
        };

        console.log('🔄 開始發送郵件...');

        // 發送郵件
        const result = await transporter.sendMail(mailOptions);
        
        console.log('✅ 郵件發送成功:', {
            messageId: result.messageId,
            to: to,
            timestamp: new Date().toISOString()
        });
        
        res.json({ 
            success: true, 
            message: '郵件發送成功',
            messageId: result.messageId 
        });

    } catch (error) {
        console.error('❌ 郵件發送失敗 - 詳細錯誤:', {
            error: error.message,
            stack: error.stack,
            to: req.body.to,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ 
            success: false, 
            error: '郵件發送失敗',
            details: error.message 
        });
    }
});

// 健康檢查端點
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: '北商熱音社郵件服務',
        timestamp: new Date().toISOString()
    });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`✅ 伺服器啟動成功，端口：${PORT}`);
    console.log(`📧 郵件 API 端點：http://localhost:${PORT}/api/send-email`);
    console.log(`❤️  健康檢查：http://localhost:${PORT}/api/health`);
    console.log(`📨 發件人：11056046@ntub.edu.tw`);
});