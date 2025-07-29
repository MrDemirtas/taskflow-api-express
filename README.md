# TaskFlow API

TaskFlow API, Express.js kullanılarak geliştirilmiş bir görev yönetimi RESTful API'sidir. Kullanıcıların projeler oluşturmasına ve bu projelere görevler eklemesine olanak tanır.

## Özellikler

- Kullanıcı kimlik doğrulaması (JWT ile kayıt ve giriş)
- Proje oluşturma, okuma, güncelleme ve silme (CRUD)
- Görev oluşturma, okuma, güncelleme ve silme (CRUD)
- Proje ve görev istatistiklerini görüntüleme
- API dokümantasyonu için Swagger entegrasyonu

## Kullanılan Teknolojiler

- **Backend:** Node.js, Express.js
- **Veritabanı:** MongoDB (Mongoose ile)
- **Kimlik Doğrulama:** JSON Web Token (jsonwebtoken), bcryptjs
- **API Dokümantasyonu:** Swagger (swagger-jsdoc, swagger-ui-express)
- **Diğer:** cors, dotenv

## Kurulum

Projeyi yerel makinenizde kurmak için aşağıdaki adımları izleyin:

1.  **Depoyu klonlayın:**

    ```bash
    git clone https://github.com/MrDemirtas/taskflow-api-express.git
    cd taskflow-api-express
    ```

2.  **Bağımlılıkları yükleyin:**

    ```bash
    npm install
    ```

3.  **Ortam değişkenlerini ayarlayın:**

    `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun ve içindeki değişkenleri kendi yapılandırmanıza göre düzenleyin.

    ```
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/taskflow
    JWT_SECRET=gizli_anahtar
    JWT_EXPIRE=1h
    PROJECT_URL=http://localhost:5000
    ```

## Kullanım

Projeyi başlatmak için aşağıdaki komutları kullanabilirsiniz:

- **Geliştirme Modu (nodemon ile):**

  ```bash
  npm run dev
  ```

- **Production Modu:**

  ```bash
  npm start
  ```

Sunucu varsayılan olarak `http://localhost:5000` adresinde çalışmaya başlayacaktır.

## API Dokümantasyonu

API endpoint'lerinin detaylı dokümantasyonuna ve test arayüzüne aşağıdaki adresten ulaşabilirsiniz:

`http://localhost:5000/api-docs`
