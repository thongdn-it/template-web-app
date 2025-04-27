# Web App

## Features

## Tech Stack

- Hono.
- Vite.
- Cloudflare Worker.
- Scalar (API Docs).
- Zod.

## Folder Structure

```
web-app/
├── src/
│   ├── db/
│   │   ├── schema.sql      # (Optional) Định nghĩa schema cho D1
│   │   ├── index.ts        # Các hàm tương tác với D1
│   │   └── types.ts        # Các kiểu dữ liệu liên quan đến DB
│   ├── routes/
│   │   ├── auth.ts         # Routes cho đăng ký, đăng nhập, OAuth callbacks
│   │   ├── users.ts        # Routes quản lý thông tin user
│   │   ├── campaigns.ts    # Routes quản lý campaigns
│   │   ├── tracking.ts     # Routes quản lý tracking links và xử lý click
│   │   ├── orders.ts       # Routes quản lý đơn hàng
│   │   └── payouts.ts      # Routes quản lý tiền hoàn/hoa hồng
│   ├── services/
│   │   ├── authService.ts
│   │   ├── campaignService.ts
│   │   └── ...             # Các service xử lý business logic
│   ├── middlewares/
│   │   ├── auth.ts         # Middleware kiểm tra JWT token
│   │   └── admin.ts        # Middleware kiểm tra quyền admin (nếu cần)
│   ├── utils/
│   │   ├── jwt.ts          # Hàm tạo và xác thực JWT
│   │   ├── hash.ts         # Hàm hash password (sử dụng Web Crypto API)
│   │   ├── tracking.ts     # Hàm tạo mã tracking unique
│   │   └── validators.ts   # Sử dụng Zod để định nghĩa schema validation
│   └── types/
│       ├── index.ts        # Các kiểu dữ liệu chung của ứng dụng
│       └── hono.d.ts       # Mở rộng kiểu cho Hono context (bindings, variables)
│   ├── index.ts           # Entry point của Worker, khởi tạo Hono, routes chính
│   ├── renderer.tsx
│   ├── style.css
└── .env                    # (Không commit) Lưu secrets local development
├── package.json
├── vite.config.ts
├── wrangler.jsonc          # Cấu hình Cloudflare Worker (bindings D1, secrets,...)
...
```

## License

This repo is open-source and available under the MIT license.

## Author

This template is developed by Thong Dang. You can contact me at thongdn.it@gmail.com

If you like my project, you can [support me][buy_me_a_coffee_url] or star (like) for it.

<p align="center">
    <img src="https://media.giphy.com/media/hXMGQqJFlIQMOjpsKC/giphy.gif" alt="template-mobile-app-buy-me-a-coffee" style="aspect-ratio:385/405;" width="200" />
</p>

[//]: # "reference links"
[buy_me_a_coffee_image_url]: https://media.giphy.com/media/hXMGQqJFlIQMOjpsKC/giphy.gif
[buy_me_a_coffee_url]: https://www.buymeacoffee.com/thongdn.it
