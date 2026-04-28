using Login.Models;
using System.Collections.Generic;

namespace Login.Data
{
    public static class FakeDatabase
    {
        public static List<User> Users { get; } = new List<User>();
        public static List<Province> Provinces { get; } = new List<Province>();
        public static List<City> Cities { get; } = new List<City>();

        static FakeDatabase()
        {
            InitializeProvincesAndCities();
            InitializeUsers();
        }

        private static void InitializeProvincesAndCities()
        {
            int provinceId = 1;
            int cityId = 1;

            // آذربایجان شرقی
            var azarbayjanSharghi = new Province { Id = provinceId++, Name = "آذربایجان شرقی", Lat = 38.1, Lon = 46.3, Cities = new List<City>() };
            AddCities(azarbayjanSharghi, ref cityId, new[] { "کشکسرای", "سهند", "سیس", "دوزدوزان", "تیمورلو" });
            Provinces.Add(azarbayjanSharghi);

            // آذربایجان غربی
            var azarbayjanGharbi = new Province { Id = provinceId++, Name = "آذربایجان غربی", Lat = 37.5, Lon = 45.0, Cities = new List<City>() };
            AddCities(azarbayjanGharbi, ref cityId, new[] { "تازه شهر", "نالوس", "ایواوغلی", "شاهین دژ", "گردکشانه" });
            Provinces.Add(azarbayjanGharbi);

            // اردبیل
            var ardabil = new Province { Id = provinceId++, Name = "اردبیل", Lat = 38.2, Lon = 48.3, Cities = new List<City>() };
            AddCities(ardabil, ref cityId, new[] { "پارس آباد", "فخراباد", "کلور", "نیر", "اردبیل" });
            Provinces.Add(ardabil);

            // اصفهان
            var isfahan = new Province { Id = provinceId++, Name = "اصفهان", Lat = 32.6, Lon = 51.7, Cities = new List<City>() };
            AddCities(isfahan, ref cityId, new[] { "گزبرخوار", "زیار", "زرین شهر", "گلشن", "پیربکران" });
            Provinces.Add(isfahan);

            // البرز
            var alborz = new Province { Id = provinceId++, Name = "البرز", Lat = 35.8, Lon = 51.0, Cities = new List<City>() };
            AddCities(alborz, ref cityId, new[] { "چهارباغ", "آسارا", "کرج", "فردیس" });
            Provinces.Add(alborz);

            // ایلام
            var ilam = new Province { Id = provinceId++, Name = "ایلام", Lat = 33.6, Lon = 46.4, Cities = new List<City>() };
            AddCities(ilam, ref cityId, new[] { "آبدانان", "شباب", "موسیان", "بدره", "ایلام", "ایوان" });
            Provinces.Add(ilam);

            // بوشهر
            var bushehr = new Province { Id = provinceId++, Name = "بوشهر", Lat = 28.9, Lon = 50.8, Cities = new List<City>() };
            AddCities(bushehr, ref cityId, new[] { "ریز", "برازجان", "بندرریگ", "اهرم", "دوراهک", "خورموج" });
            Provinces.Add(bushehr);

            // تهران
            var tehran = new Province { Id = provinceId++, Name = "تهران", Lat = 35.7, Lon = 51.4, Cities = new List<City>() };
            AddCities(tehran, ref cityId, new[] {
        "شاهدشهر", "پیشوا", "جوادآباد", "ارجمند", "ری", "نصیرشهر", "رودهن", "اندیشه",
        "نسیم شهر", "صباشهر", "ملارد", "تهران", "بومهن", "لواسان", "دماوند", "پردیس"
    });
            Provinces.Add(tehran);

            // چهارمحال و بختیاری
            var chaharmahal = new Province { Id = provinceId++, Name = "چهارمحال و بختیاری", Lat = 32.3, Lon = 50.8, Cities = new List<City>() };
            AddCities(chaharmahal, ref cityId, new[] { "وردنجان", "گوجان", "گهرو", "سورشجان", "سرخون", "شهرکرد", "منج" });
            Provinces.Add(chaharmahal);

            // خراسان جنوبی
            var khorasanJonubi = new Province { Id = provinceId++, Name = "خراسان جنوبی", Lat = 32.8, Lon = 59.1, Cities = new List<City>() };
            AddCities(khorasanJonubi, ref cityId, new[] { "اسلامیه", "شوسف", "قاین", "عشق آباد", "طبس مسینا", "ارسک" });
            Provinces.Add(khorasanJonubi);

            // خراسان رضوی
            var khorasanRazavi = new Province { Id = provinceId++, Name = "خراسان رضوی", Lat = 36.3, Lon = 59.6, Cities = new List<City>() };
            AddCities(khorasanRazavi, ref cityId, new[] {
        "بار", "نیل شهر", "جنگل", "درود", "رباط سنگ", "سلطان آباد", "فریمان", "گناباد"
    });
            Provinces.Add(khorasanRazavi);

            // خراسان شمالی
            var khorasanShomali = new Province { Id = provinceId++, Name = "خراسان شمالی", Lat = 37.4, Lon = 57.3, Cities = new List<City>() };
            AddCities(khorasanShomali, ref cityId, new[] {
        "چناران شهر", "راز", "پیش قلعه", "قوشخانه", "شوقان", "اسفراین", "گرمه", "قاضی",
        "شیروان", "حصارگرمخان", "آشخانه", "تیتکانلو", "جاجرم", "بجنورد", "درق", "آوا",
        "زیارت", "سنخواست", "صفی آباد", "ایور", "فاروج", "لوجلی"
    });
            Provinces.Add(khorasanShomali);

            // خوزستان
            var khuzestan = new Province { Id = provinceId++, Name = "خوزستان", Lat = 31.3, Lon = 48.7, Cities = new List<City>() };
            AddCities(khuzestan, ref cityId, new[] {
        "هفتگل", "بیدروبه", "شاوور", "حمزه", "گتوند", "شرافت", "مسجدسلیمان", "اندیمشک",
        "الوان", "سالند", "هویزه", "آزادی", "شوش", "دزفول"
    });
            Provinces.Add(khuzestan);

            // زنجان
            var zanjan = new Province { Id = provinceId++, Name = "زنجان", Lat = 36.7, Lon = 48.5, Cities = new List<City>() };
            AddCities(zanjan, ref cityId, new[] { "سجاس", "زرین رود", "آب بر", "ارمغانخانه", "کرسف" });
            Provinces.Add(zanjan);

            // سمنان
            var semnan = new Province { Id = provinceId++, Name = "سمنان", Lat = 35.6, Lon = 53.5, Cities = new List<City>() };
            AddCities(semnan, ref cityId, new[] { "ایوانکی", "مجن", "دامغان", "سرخه", "مهدی شهر", "شاهرود" });
            Provinces.Add(semnan);

            // سیستان و بلوچستان
            var sistan = new Province { Id = provinceId++, Name = "سیستان و بلوچستان", Lat = 29.5, Lon = 60.6, Cities = new List<City>() };
            AddCities(sistan, ref cityId, new[] { "محمدی", "شهرک علی اکبر", "بنجار", "گلمورتی", "نگور", "راسک", "بنت" });
            Provinces.Add(sistan);

            // فارس
            var fars = new Province { Id = provinceId++, Name = "فارس", Lat = 29.6, Lon = 52.5, Cities = new List<City>() };
            AddCities(fars, ref cityId, new[] {
        "کازرون", "کارزین (فتح آباد)", "فدامی", "خومه زار", "سلطان شهر", "فیروزآباد",
        "دبیران", "باب انار", "رامجرد", "سروستان", "قره بلاغ"
    });
            Provinces.Add(fars);

            // قزوین
            var qazvin = new Province { Id = provinceId++, Name = "قزوین", Lat = 36.3, Lon = 50.0, Cities = new List<City>() };
            AddCities(qazvin, ref cityId, new[] { "سگزآباد", "بیدستان", "کوهین", "رازمیان", "خرمدشت", "آبگرم", "شال", "شریفیه" });
            Provinces.Add(qazvin);

            // قم
            var qom = new Province { Id = provinceId++, Name = "قم", Lat = 34.6, Lon = 50.9, Cities = new List<City>() };
            AddCities(qom, ref cityId, new[] { "کهک", "قم", "سلفچگان", "جعفریه", "قنوات", "دستجرد" });
            Provinces.Add(qom);

            // کردستان
            var kordestan = new Province { Id = provinceId++, Name = "کردستان", Lat = 35.3, Lon = 47.0, Cities = new List<City>() };
            AddCities(kordestan, ref cityId, new[] { "قروه", "توپ آغاج", "سروآباد", "بویین سفلی", "زرینه", "دلبران", "سنندج", "یاسوکند" });
            Provinces.Add(kordestan);

            // کرمان
            var kerman = new Province { Id = provinceId++, Name = "کرمان", Lat = 30.3, Lon = 57.1, Cities = new List<City>() };
            AddCities(kerman, ref cityId, new[] { "کهنوج", "بلوک", "پاریز", "گنبکی", "زنگی آباد", "بم", "خانوک", "کیانشهر" });
            Provinces.Add(kerman);

            // کرمانشاه
            var kermanshah = new Province { Id = provinceId++, Name = "کرمانشاه", Lat = 34.3, Lon = 47.1, Cities = new List<City>() };
            AddCities(kermanshah, ref cityId, new[] { "سنقر", "شاهو", "بانوره", "تازه آباد", "هلشی", "جوانرود", "قصرشیرین", "نوسود", "کرند" });
            Provinces.Add(kermanshah);

            // کهگیلویه وبویراحمد
            var kohgiluyeh = new Province { Id = provinceId++, Name = "کهگیلویه وبویراحمد", Lat = 30.8, Lon = 51.6, Cities = new List<City>() };
            AddCities(kohgiluyeh, ref cityId, new[] { "گراب سفلی", "لنده", "سی سخت", "دهدشت", "یاسوج", "سرفاریاب", "دوگنبدان", "چیتاب" });
            Provinces.Add(kohgiluyeh);

            // گلستان
            var golestan = new Province { Id = provinceId++, Name = "گلستان", Lat = 36.8, Lon = 54.4, Cities = new List<City>() };
            AddCities(golestan, ref cityId, new[] { "سیمین شهر", "مزرعه", "رامیان", "فراغی", "گنبدکاووس", "کردکوی", "مراوه", "بندرترکمن", "نگین شهر", "آق قلا" });
            Provinces.Add(golestan);

            // گیلان
            var gilan = new Province { Id = provinceId++, Name = "گیلان", Lat = 37.3, Lon = 49.6, Cities = new List<City>() };
            AddCities(gilan, ref cityId, new[] { "منجیل", "شلمان", "خشکبیجار", "ماکلوان", "سنگر", "مرجقل", "رودبار", "کومله", "رشت", "ماسوله", "خمام", "ماسال" });
            Provinces.Add(gilan);

            // لرستان
            var lorestan = new Province { Id = provinceId++, Name = "لرستان", Lat = 33.5, Lon = 48.3, Cities = new List<City>() };
            AddCities(lorestan, ref cityId, new[] { "چالانچولان", "بیران شهر", "ویسیان", "شول آباد", "پلدختر", "کوهدشت", "هفت چشمه" });
            Provinces.Add(lorestan);

            // مازندران
            var mazandaran = new Province { Id = provinceId++, Name = "مازندران", Lat = 36.5, Lon = 52.5, Cities = new List<City>() };
            AddCities(mazandaran, ref cityId, new[] { "گلوگاه", "پل سفید", "دابودشت", "چالوس", "کیاسر", "بهنمیر", "تنکابن", "شیرود", "شیرگاه", "رویان", "زرگرمحله", "عباس اباد" });
            Provinces.Add(mazandaran);

            // مرکزی
            var markazi = new Province { Id = provinceId++, Name = "مرکزی", Lat = 34.1, Lon = 49.7, Cities = new List<City>() };
            AddCities(markazi, ref cityId, new[] { "آستانه", "خنجین", "نراق", "کمیجان", "آشتیان", "رازقان", "مهاجران" });
            Provinces.Add(markazi);

            // هرمزگان
            var hormozgan = new Province { Id = provinceId++, Name = "هرمزگان", Lat = 27.2, Lon = 56.3, Cities = new List<City>() };
            AddCities(hormozgan, ref cityId, new[] { "بیکاء", "تیرور", "گروک", "قشم", "کوشکنار", "کیش", "سرگز", "بندرعباس" });
            Provinces.Add(hormozgan);

            // همدان
            var hamedan = new Province { Id = provinceId++, Name = "همدان", Lat = 34.8, Lon = 48.5, Cities = new List<City>() };
            AddCities(hamedan, ref cityId, new[] { "زنگنه", "دمق", "سرکان", "آجین", "جورقان", "برزول", "فامنین", "سامن", "بهار", "فرسفج" });
            Provinces.Add(hamedan);

            // یزد
            var yazd = new Province { Id = provinceId++, Name = "یزد", Lat = 31.8, Lon = 54.3, Cities = new List<City>() };
            AddCities(yazd, ref cityId, new[] { "مروست", "مهردشت", "حمیدیا", "تفت", "اشکذر", "ندوشن", "یزد", "عقدا", "بهاباد" });
            Provinces.Add(yazd);
        }

        private static void AddCities(Province province, ref int cityId, string[] cityNames)
        {
            foreach (var cityName in cityNames)
            {
                province.Cities.Add(new City { Id = cityId++, Name = cityName, ProvinceId = province.Id });
                Cities.Add(new City { Id = cityId - 1, Name = cityName, ProvinceId = province.Id });
            }
        }

        private static void InitializeUsers()
        {
            Users.Add(new User { Id = 1, FirstName = "علی", LastName = "احمدی", Username = "ali", Password = "123456", Email = "ali@test.com", Phone = "09121111111", ProvinceId = 18, CityId = 141, Lon = 50.02, Lat = 36.32 , UserType = "admin", });
            Users.Add(new User { Id = 2, FirstName = "زهرا", LastName = "کریمی", Username = "zahra", Password = "123456", Email = "zahra@test.com", Phone = "09122222222", ProvinceId = 1, CityId = 3, Lon = 46.16, Lat = 38.01 , UserType = "plus", });
            Users.Add(new User { Id = 3, FirstName = "محمد", LastName = "محمدی", Username = "mohammad", Password = "123456", Email = "mohammad@test.com", Phone = "09123333333", ProvinceId = 4, CityId = 19, Lon = 51.71, Lat = 32.54 , UserType = "special", });
            Users.Add(new User { Id = 4, FirstName = "فاطمه", LastName = "حسینی", Username = "fatemeh", Password = "123456", Email = "fatemeh@test.com", Phone = "09124444444", ProvinceId = 8, CityId = 47, Lon = 51.79, Lat = 35.15 , UserType = "user",});
            Users.Add(new User { Id = 5, FirstName = "رضا", LastName = "رضایی", Username = "reza", Password = "123456", Email = "reza@test.com", Phone = "09125555555", ProvinceId = 13, CityId = 102, Lon = 48.61, Lat = 31.40 , UserType = "user",});
            Users.Add(new User { Id = 6, FirstName = "سارا", LastName = "موسوی", Username = "sara", Password = "123456", Email = "sara@test.com", Phone = "09126666666", ProvinceId = 8, CityId = 43, Lon = 51.31, Lat = 35.66 , UserType = "admin", });
            Users.Add(new User { Id = 7, FirstName = "احمد", LastName = "نوری", Username = "ahmad", Password = "123456", Email = "ahmad@test.com", Phone = "09127777777", ProvinceId = 24, CityId = 186, Lon = 54.29, Lat = 36.92 , UserType = "plus", });
            Users.Add(new User { Id = 8, FirstName = "نرگس", LastName = "کاظمی", Username = "narges", Password = "123456", Email = "narges@test.com", Phone = "09128888888", ProvinceId = 8, CityId = 50, Lon = 51.49, Lat = 35.17 , UserType = "user",});
            Users.Add(new User { Id = 9, FirstName = "مهدی", LastName = "صادقی", Username = "mehdi", Password = "123456", Email = "mehdi@test.com", Phone = "09129999999", ProvinceId = 4, CityId = 18, Lon = 51.70, Lat = 32.73 , UserType = "plus", });
            Users.Add(new User { Id = 10, FirstName = "لیلا", LastName = "جعفری", Username = "leila", Password = "123456", Email = "leila@test.com", Phone = "09120000000", ProvinceId = 8, CityId = 51, Lon = 51.41, Lat = 35.66 , UserType = "user",});
            Users.Add(new User { Id = 11, FirstName = "عباس", LastName = "عباسی", Username = "abas", Password = "123456", Email = "abas@test.com", Phone = "09120000000", ProvinceId = 2, CityId = 9, Lon = 45.02, Lat = 37.54 , UserType = "plus", });
            Users.Add(new User { Id = 12, FirstName = "مهشید", LastName = "رحیمی", Username = "mahshid", Password = "123456", Email = "mahshid@test.com", Phone = "09120000000", ProvinceId = 8, CityId = 43, Lon = 51.30, Lat = 35.15 , UserType = "user",});
            Users.Add(new User { Id = 13, FirstName = "کاظم", LastName = "قاقی", Username = "ghaghi", Password = "123456", Email = "kazem@test.com", Phone = "09120000000", ProvinceId = 14, CityId = 110, Lon = 48.50, Lat = 36.63 , UserType = "user",});
            Users.Add(new User { Id = 14, FirstName = "حسین", LastName = "عباسی", Username = "hossein", Password = "123456", Email = "hossein@test.com", Phone = "09120111111", ProvinceId = 8, CityId = 42, Lon = 51.49, Lat = 35.19 , UserType = "plus", });
            Users.Add(new User { Id = 15, FirstName = "مریم", LastName = "ابراهیمی", Username = "maryam", Password = "123456", Email = "maryam@test.com", Phone = "09120222222", ProvinceId = 4, CityId = 17, Lon = 51.69, Lat = 32.72 , UserType = "user",});
            Users.Add(new User { Id = 16, FirstName = "یوسف", LastName = "زمانی", Username = "yousef", Password = "123456", Email = "yousef@test.com", Phone = "09120333333", ProvinceId = 7, CityId = 33, Lon = 50.70, Lat = 28.99 , UserType = "special", });
            Users.Add(new User { Id = 17, FirstName = "الهام", LastName = "قاسمی", Username = "elham", Password = "123456", Email = "elham@test.com", Phone = "09120444444", ProvinceId = 8, CityId = 48, Lon = 51.66, Lat = 35.66 , UserType = "user",});
            Users.Add(new User { Id = 18, FirstName = "امیر", LastName = "رحیمی", Username = "amir", Password = "123456", Email = "amir@test.com", Phone = "09120555555", ProvinceId = 5, CityId = 24, Lon = 51.09, Lat = 35.76 , UserType = "plus", });
            Users.Add(new User { Id = 19, FirstName = "سمیه", LastName = "کوهی", Username = "somayeh", Password = "123456", Email = "somayeh@test.com", Phone = "09120666666", ProvinceId = 8, CityId = 44, Lon = 51.10, Lat = 35.66 , UserType = "user",});
            Users.Add(new User { Id = 20, FirstName = "پویا", LastName = "رستمی", Username = "pooya", Password = "123456", Email = "pooya@test.com", Phone = "09120777777", ProvinceId = 7, CityId = 33, Lon = 50.70, Lat = 28.99 , UserType = "user",});
            Users.Add(new User { Id = 21, FirstName = "نگار", LastName = "دهقانی", Username = "negar", Password = "123456", Email = "negar@test.com", Phone = "09120888888", ProvinceId = 12, CityId = 87, Lon = 57.43, Lat = 37.41 , UserType = "user",});
            Users.Add(new User { Id = 22, FirstName = "سعید", LastName = "مرادی", Username = "saeed", Password = "123456", Email = "saeed@test.com", Phone = "09120999999", ProvinceId = 9, CityId = 57, Lon = 50.97, Lat = 32.38 , UserType = "admin", });
            Users.Add(new User { Id = 23, FirstName = "پرستو", LastName = "خلیلی", Username = "parasto", Password = "123456", Email = "parasto@test.com", Phone = "09121010101", ProvinceId = 8, CityId = 52, Lon = 51.25, Lat = 35.09 , UserType = "plus", });
            Users.Add(new User { Id = 24, FirstName = "کامران", LastName = "شریفی", Username = "kamran", Password = "123456", Email = "kamran@test.com", Phone = "09121121212", ProvinceId = 1, CityId = 4, Lon = 46.17, Lat = 38.02 , UserType = "user",});
            Users.Add(new User { Id = 25, FirstName = "رویا", LastName = "نجفی", Username = "roya", Password = "123456", Email = "roya@test.com", Phone = "09121232323", ProvinceId = 8, CityId = 46, Lon = 51.40, Lat = 35.36 , UserType = "user",});
            Users.Add(new User { Id = 26, FirstName = "کیان", LastName = "میرزایی", Username = "kian", Password = "123456", Email = "kian@test.com", Phone = "09131111111", ProvinceId = 3, CityId = 15, Lon = 48.28, Lat = 38.30 , UserType = "special", });
            Users.Add(new User { Id = 27, FirstName = "شبنم", LastName = "نظری", Username = "shabnam", Password = "123456", Email = "shabnam@test.com", Phone = "09132222222", ProvinceId = 8, CityId = 49, Lon = 51.05, Lat = 35.96 , UserType = "user",});
            Users.Add(new User { Id = 28, FirstName = "آرمان", LastName = "سلیمانی", Username = "arman", Password = "123456", Email = "arman@test.com", Phone = "09133333333", ProvinceId = 10, CityId = 65, Lon = 59.10, Lat = 32.79 , UserType = "special", });
            Users.Add(new User { Id = 29, FirstName = "پریسا", LastName = "کیانی", Username = "parisa", Password = "123456", Email = "parisa@test.com", Phone = "09134444444", ProvinceId = 16, CityId = 127, Lon = 60.74, Lat = 29.41 , UserType = "user",});
            Users.Add(new User { Id = 30, FirstName = "فرهاد", LastName = "فتاحی", Username = "farhad", Password = "123456", Email = "farhad@test.com", Phone = "09135555555", ProvinceId = 11, CityId = 76, Lon = 59.59, Lat = 36.33 , UserType = "plus", });
            Users.Add(new User { Id = 31, FirstName = "ناهید", LastName = "صمدی", Username = "nahid", Password = "123456", Email = "nahid@test.com", Phone = "09136666666", ProvinceId = 6, CityId = 32, Lon = 46.29, Lat = 33.65 , UserType = "user",});
            Users.Add(new User { Id = 32, FirstName = "بابک", LastName = "خدابنده", Username = "babak", Password = "123456", Email = "babak@test.com", Phone = "09137777777", ProvinceId = 8, CityId = 45, Lon = 51.15, Lat = 35.19 , UserType = "user",});
            Users.Add(new User { Id = 33, FirstName = "سحر", LastName = "بهزادی", Username = "sahar", Password = "123456", Email = "sahar@test.com", Phone = "09138888888", ProvinceId = 15, CityId = 119, Lon = 53.49, Lat = 35.62 , UserType = "special", });
            Users.Add(new User { Id = 34, FirstName = "دانیال", LastName = "پوراحمد", Username = "danial", Password = "123456", Email = "danial@test.com", Phone = "09139999999", ProvinceId = 5, CityId = 23, Lon = 51.08, Lat = 35.75 , UserType = "plus", });
            Users.Add(new User { Id = 35, FirstName = "مرجان", LastName = "کامرانی", Username = "marjan", Password = "123456", Email = "marjan@test.com", Phone = "09131010101", ProvinceId = 17, CityId = 132, Lon = 52.46, Lat = 29.56 , UserType = "user",});
            Users.Add(new User { Id = 36, FirstName = "سامان", LastName = "نوروزی", Username = "saman", Password = "123456", Email = "saman@test.com", Phone = "09141111111", ProvinceId = 20, CityId = 161, Lon = 46.91, Lat = 35.36 , UserType = "user",});
            Users.Add(new User { Id = 37, FirstName = "الهه", LastName = "مقدم", Username = "elahe", Password = "123456", Email = "elahe@test.com", Phone = "09142222222", ProvinceId = 8, CityId = 52, Lon = 51.40, Lat = 35.79 , UserType = "admin", });
            Users.Add(new User { Id = 38, FirstName = "شایان", LastName = "غلامی", Username = "shayan", Password = "123456", Email = "shayan@test.com", Phone = "09143333333", ProvinceId = 19, CityId = 153, Lon = 51.02, Lat = 34.60 , UserType = "plus", });
            Users.Add(new User { Id = 39, FirstName = "راحله", LastName = "عابدینی", Username = "rahele", Password = "123456", Email = "rahele@test.com", Phone = "09144444444", ProvinceId = 21, CityId = 170, Lon = 57.08, Lat = 30.20 , UserType = "user",});
            Users.Add(new User { Id = 40, FirstName = "پژمان", LastName = "فرهادی", Username = "pejman", Password = "123456", Email = "pejman@test.com", Phone = "09145555555", ProvinceId = 4, CityId = 20, Lon = 51.72, Lat = 32.75 , UserType = "user",});
            Users.Add(new User { Id = 41, FirstName = "سودابه", LastName = "کرمی", Username = "sudabe", Password = "123456", Email = "sudabe@test.com", Phone = "09146666666", ProvinceId = 8, CityId = 41, Lon = 51.17, Lat = 35.70 , UserType = "user",});
            Users.Add(new User { Id = 42, FirstName = "فرشید", LastName = "حیدری", Username = "farshid", Password = "123456", Email = "farshid@test.com", Phone = "09147777777", ProvinceId = 22, CityId = 175, Lon = 47.13, Lat = 34.30 , UserType = "user",});
            Users.Add(new User { Id = 43, FirstName = "ژیلا", LastName = "رضایی", Username = "zhila", Password = "123456", Email = "zhila@test.com", Phone = "09148888888", ProvinceId = 23, CityId = 182, Lon = 51.70, Lat = 30.71 , UserType = "plus", });
            Users.Add(new User { Id = 44, FirstName = "هومن", LastName = "صادقی", Username = "hooman", Password = "123456", Email = "hooman@test.com", Phone = "09149999999", ProvinceId = 8, CityId = 42, Lon = 51.25, Lat = 35.99 , UserType = "special", });
            Users.Add(new User { Id = 45, FirstName = "بهناز", LastName = "شجاعی", Username = "behnaz", Password = "123456", Email = "behnaz@test.com", Phone = "09141010101", ProvinceId = 25, CityId = 191, Lon = 49.48, Lat = 37.20 , UserType = "plus", });
            Users.Add(new User { Id = 46, FirstName = "آرین", LastName = "قربانی", Username = "arian", Password = "123456", Email = "arian@test.com", Phone = "09151111111", ProvinceId = 13, CityId = 104, Lon = 48.63, Lat = 31.42 , UserType = "user",});
            Users.Add(new User { Id = 47, FirstName = "سپیده", LastName = "مهدوی", Username = "sepide", Password = "123456", Email = "sepide@test.com", Phone = "09152222222", ProvinceId = 8, CityId = 47, Lon = 51.85, Lat = 35.05 , UserType = "user",});
            Users.Add(new User { Id = 48, FirstName = "ایمان", LastName = "باقری", Username = "iman", Password = "123456", Email = "iman@test.com", Phone = "09153333333", ProvinceId = 26, CityId = 197, Lon = 48.31, Lat = 33.47 , UserType = "plus", });
            Users.Add(new User { Id = 49, FirstName = "رقیه", LastName = "اسدی", Username = "roghayeh", Password = "123456", Email = "roghayeh@test.com", Phone = "09154444444", ProvinceId = 8, CityId = 50, Lon = 51.79, Lat = 35.15 , UserType = "user",});
            Users.Add(new User { Id = 50, FirstName = "امید", LastName = "جهانگیری", Username = "omid", Password = "123456", Email = "omid@test.com", Phone = "09155555555", ProvinceId = 27, CityId = 202, Lon = 53.07, Lat = 36.60 , UserType = "user",});
            Users.Add(new User { Id = 51, FirstName = "سعیده", LastName = "فرجی", Username = "saide", Password = "123456", Email = "saide@test.com", Phone = "09156666666", ProvinceId = 8, CityId = 43, Lon = 51.44, Lat = 35.45 , UserType = "plus", });
            Users.Add(new User { Id = 52, FirstName = "میلاد", LastName = "محبی", Username = "milad", Password = "123456", Email = "milad@test.com", Phone = "09157777777", ProvinceId = 28, CityId = 207, Lon = 49.74, Lat = 34.17 , UserType = "plus", });
            Users.Add(new User { Id = 53, FirstName = "معصومه", LastName = "نیکنام", Username = "masoume", Password = "123456", Email = "masoume@test.com", Phone = "09158888888", ProvinceId = 8, CityId = 51, Lon = 51.99, Lat = 35.77 , UserType = "user",});
            Users.Add(new User { Id = 54, FirstName = "آرش", LastName = "ملکی", Username = "arash", Password = "123456", Email = "arash@test.com", Phone = "09159999999", ProvinceId = 29, CityId = 212, Lon = 56.39, Lat = 27.11 , UserType = "user",});
            Users.Add(new User { Id = 55, FirstName = "فریبا", LastName = "زندی", Username = "fariba", Password = "123456", Email = "fariba@test.com", Phone = "09151010101", ProvinceId = 8, CityId = 44, Lon = 51.41, Lat = 35.31 , UserType = "special", });
            Users.Add(new User { Id = 56, FirstName = "آرمان", LastName = "حسن‌پور", Username = "arman2", Password = "123456", Email = "arman2@test.com", Phone = "09161111111", ProvinceId = 30, CityId = 217, Lon = 48.36, Lat = 34.77 , UserType = "plus", });
            Users.Add(new User { Id = 57, FirstName = "الهام", LastName = "کریمی", Username = "elham2", Password = "123456", Email = "elham2@test.com", Phone = "09162222222", ProvinceId = 8, CityId = 46, Lon = 51.55, Lat = 35.41 , UserType = "user",});
            Users.Add(new User { Id = 58, FirstName = "پیمان", LastName = "عباسی", Username = "peyman", Password = "123456", Email = "peyman@test.com", Phone = "09163333333", ProvinceId = 31, CityId = 222, Lon = 54.00, Lat = 31.05 , UserType = "user",});
            Users.Add(new User { Id = 59, FirstName = "مریم", LastName = "حسین‌پور", Username = "maryam2", Password = "123456", Email = "maryam2@test.com", Phone = "09164444444", ProvinceId = 8, CityId = 48, Lon = 51.94, Lat = 35.15, UserType = "special", });
            Users.Add(new User { Id = 60, FirstName = "حامد", LastName = "محمدی", Username = "hamed", Password = "123456", Email = "hamed@test.com", Phone = "09165555555", ProvinceId = 2, CityId = 8, Lon = 45.01, Lat = 37.53 , UserType = "plus", });
            Users.Add(new User { Id = 61, FirstName = "سمیرا", LastName = "قاسمی", Username = "samira", Password = "123456", Email = "samira@test.com", Phone = "09166666666", ProvinceId = 8, CityId = 52, Lon = 51.40, Lat = 35.60 , UserType = "plus", });
            Users.Add(new User { Id = 62, FirstName = "فرید", LastName = "محمدپور", Username = "farid", Password = "123456", Email = "farid@test.com", Phone = "09167777777", ProvinceId = 4, CityId = 16, Lon = 51.68, Lat = 32.71 , UserType = "user",});
            Users.Add(new User { Id = 63, FirstName = "نسترن", LastName = "احمدی", Username = "nastaran", Password = "123456", Email = "nastaran@test.com", Phone = "09168888888", ProvinceId = 8, CityId = 49, Lon = 51.15, Lat = 35.86 , UserType = "user",});
            Users.Add(new User { Id = 64, FirstName = "احسان", LastName = "علیزاده", Username = "ehsan", Password = "123456", Email = "ehsan@test.com", Phone = "09169999999", ProvinceId = 1, CityId = 2, Lon = 46.15, Lat = 38.00 , UserType = "plus", });
            Users.Add(new User { Id = 65, FirstName = "لیلا", LastName = "محمدزاده", Username = "leila2", Password = "123456", Email = "leila2@test.com", Phone = "09161010101", ProvinceId = 8, CityId = 45, Lon = 51.51, Lat = 35.72 , UserType = "user",});
            Users.Add(new User { Id = 66, FirstName = "کاوه", LastName = "رحمانی", Username = "kaveh", Password = "123456", Email = "kaveh@test.com", Phone = "09171111111", ProvinceId = 14, CityId = 111, Lon = 48.51, Lat = 36.64 , UserType = "special", });
            Users.Add(new User { Id = 67, FirstName = "پرنیان", LastName = "کاظمی", Username = "parnian", Password = "123456", Email = "parnian@test.com", Phone = "09172222222", ProvinceId = 8, CityId = 41, Lon = 51.57, Lat = 35.19 , UserType = "plus", });
            Users.Add(new User { Id = 68, FirstName = "شاهین", LastName = "بهرامی", Username = "shahin", Password = "123456", Email = "shahin@test.com", Phone = "09173333333", ProvinceId = 5, CityId = 22, Lon = 51.07, Lat = 35.74 , UserType = "user",});
            Users.Add(new User { Id = 69, FirstName = "مهسا", LastName = "امینی", Username = "mahsa", Password = "123456", Email = "mahsa@test.com", Phone = "09174444444", ProvinceId = 8, CityId = 47, Lon = 51.20, Lat = 35.94 , UserType = "admin", });
            Users.Add(new User { Id = 70, FirstName = "رضا", LastName = "موسوی", Username = "reza2", Password = "123456", Email = "reza2@test.com", Phone = "09175555555", ProvinceId = 11, CityId = 75, Lon = 59.85, Lat = 36.92 , UserType = "user",});
            Users.Add(new User { Id = 71, FirstName = "بهاره", LastName = "شفیعی", Username = "bahare", Password = "123456", Email = "bahare@test.com", Phone = "09176666666", ProvinceId = 8, CityId = 42, Lon = 51.18, Lat = 35.84 , UserType = "plus", });
            Users.Add(new User { Id = 72, FirstName = "فرزاد", LastName = "ناصری", Username = "farzad", Password = "123456", Email = "farzad@test.com", Phone = "09177777777", ProvinceId = 7, CityId = 34, Lon = 50.71, Lat = 29.00 , UserType = "plus", });
            Users.Add(new User { Id = 73, FirstName = "سارا", LastName = "داوودی", Username = "sara2", Password = "123456", Email = "sara2@test.com", Phone = "09178888888", ProvinceId = 8, CityId = 44, Lon = 51.32, Lat = 35.41 , UserType = "plus", });
            Users.Add(new User { Id = 74, FirstName = "محمدرضا", LastName = "محمدی", Username = "mohammadreza", Password = "123456", Email = "mohammadreza@test.com", Phone = "09179999999", ProvinceId = 4, CityId = 19, Lon = 51.71, Lat = 32.74 , UserType = "user",});
            Users.Add(new User { Id = 75, FirstName = "زهره", LastName = "نصرتی", Username = "zohre", Password = "123456", Email = "zohre@test.com", Phone = "09171010101", ProvinceId = 8, CityId = 50, Lon = 51.75, Lat = 34.48 , UserType = "special", });
        }
    }
}