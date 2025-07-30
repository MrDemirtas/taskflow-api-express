# TaskFlow API

TaskFlow API, Express.js kullanılarak geliştirilmiş bir görev yönetimi RESTful API'sidir. Kullanıcıların projeler oluşturmasına ve bu projelere görevler eklemesine olanak tanır. API, JWT tabanlı kimlik doğrulama, veri validasyonu ve kapsamlı API dokümantasyonu içerir.

## Özellikler

- **Kullanıcı Yönetimi**: JWT ile güvenli kayıt ve giriş işlemleri
- **Proje Yönetimi**: Projelerin oluşturulması, listelenmesi, güncellenmesi ve silinmesi
- **Görev Yönetimi**: Görevlerin oluşturulması, listelenmesi, güncellenmesi ve silinmesi
- **İstatistikler**: Görev durumu dağılımı, kullanıcı iş yükü, ortalama tamamlanma süresi gibi istatistikler
- **Validasyon**: Express-validator ile kapsamlı veri doğrulama
- **API Dokümantasyonu**: Swagger ile otomatik API dokümantasyonu

## Kullanılan Teknolojiler

- **Backend**: Node.js, Express.js
- **Veritabanı**: MongoDB (Mongoose ile)
- **Kimlik Doğrulama**: JSON Web Token (jsonwebtoken), bcryptjs
- **Validasyon**: Express-validator
- **API Dokümantasyonu**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Diğer**: cors, dotenv

## Proje Yapısı

```
├── config/             # Veritabanı yapılandırması
├── controllers/        # İş mantığı kontrolörleri
├── middleware/         # Ara yazılımlar (kimlik doğrulama vb.)
├── models/             # Mongoose modelleri
├── routes/             # API rotaları
├── swagger/            # Swagger dokümantasyon dosyaları
│   └── models/         # Swagger model tanımlamaları
├── utils/              # Yardımcı fonksiyonlar
├── validations/        # Veri doğrulama şemaları
├── app.js              # Express uygulaması
├── server.js           # Sunucu başlatma
└── swagger.js          # Swagger yapılandırması
```

## Veri Modelleri

### Kullanıcı (User)

```javascript
{
  name: {                // Kullanıcı adı (min: 3 karakter)
    type: String,
    required: true
  },
  email: {               // Benzersiz email adresi
    type: String,
    required: true,
    unique: true
  },
  password: {            // Şifre (min: 6 karakter, hash'lenir)
    type: String,
    required: true
  }
}
```

### Proje (Project)

```javascript
{
  name: {                // Proje adı (min: 3, max: 100 karakter)
    type: String,
    required: true
  },
  description: {         // Proje açıklaması (max: 1000 karakter)
    type: String
  },
  owner: {               // Projeyi oluşturan kullanıcı
    type: ObjectId,
    ref: "User",
    required: true
  }
}
```

### Görev (Task)

```javascript
{
  title: {               // Görev başlığı (min: 3, max: 100 karakter)
    type: String,
    required: true
  },
  description: {         // Görev açıklaması (max: 1000 karakter)
    type: String
  },
  status: {              // Görev durumu
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },
  priority: {            // Görev önceliği
    type: String,
    enum: ["low", "medium", "high"]
  },
  estimateHours: {       // Tahmini tamamlanma süresi (saat)
    type: Number,
    default: 1
  },
  dueDate: {             // Görevin bitiş tarihi
    type: Date
  },
  deadlineDate: {        // Görevin son teslim tarihi
    type: Date
  },
  project: {             // Görevin bağlı olduğu proje
    type: ObjectId,
    ref: "Project",
    required: true
  },
  owner: {               // Görevi oluşturan kullanıcı
    type: ObjectId,
    ref: "User",
    required: true
  }
}
```

## API Endpoint'leri

### Kimlik Doğrulama

- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Projeler

- `GET /api/projects` - Tüm projeleri listele
- `POST /api/projects` - Yeni proje oluştur
- `PUT /api/projects/:id` - Projeyi güncelle
- `DELETE /api/projects/:id` - Projeyi sil

### Görevler

- `GET /api/tasks` - Tüm görevleri listele
- `POST /api/tasks` - Yeni görev oluştur
- `PUT /api/tasks/:id` - Görevi güncelle
- `DELETE /api/tasks/:id` - Görevi sil

### İstatistikler

- `GET /api/stats/status-distribution` - Görev durum dağılımı
- `GET /api/stats/user-workload` - Kullanıcı iş yükü
- `GET /api/stats/avg-completion-time` - Ortalama tamamlanma süresi
- `GET /api/stats/completed-weekly` - Haftalık tamamlanan görevler
- `GET /api/stats/completed-daily` - Günlük tamamlanan görevler
- `GET /api/stats/upcoming-deadlines` - Yaklaşan son teslim tarihleri

## Validasyon Şemaları

API, tüm giriş verilerini doğrulamak için express-validator kullanır:

### Kullanıcı Validasyonu

- **Kayıt**: Ad (min: 3 karakter), geçerli e-posta, şifre (min: 6 karakter)
- **Giriş**: Geçerli e-posta, şifre (min: 6 karakter)

### Proje Validasyonu

- **Oluşturma**: Ad (min: 3, max: 100 karakter), açıklama (max: 1000 karakter)
- **Güncelleme**: Geçerli MongoDB ID, ad ve açıklama validasyonu

### Görev Validasyonu

- **Oluşturma**: Başlık (min: 3, max: 100 karakter), açıklama (max: 1000 karakter), öncelik (low/medium/high), tahmini süre (min: 1 saat), geçerli proje ID'si
- **Güncelleme**: Geçerli MongoDB ID, başlık, açıklama, durum (todo/in-progress/done), öncelik, tahmini süre validasyonu

## Kurulum

Projeyi yerel makinenizde kurmak için aşağıdaki adımları izleyin:

1. **Depoyu klonlayın:**

   ```bash
   git clone https://github.com/MrDemirtas/taskflow-api-express.git
   cd taskflow-api-express
   ```

2. **Bağımlılıkları yükleyin:**

   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın:**

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

## Güvenlik

- Tüm şifreler bcrypt ile hash'lenir
- Kimlik doğrulama JWT ile yapılır
- Tüm API endpoint'leri (kimlik doğrulama hariç) JWT token gerektirir
- Kullanıcılar sadece kendi oluşturdukları projeleri ve görevleri yönetebilir
