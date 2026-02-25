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
            var azarbayjanSharghi = new Province { Id = provinceId++, Name = "آذربایجان شرقی", Cities = new List<City>() };
            AddCities(azarbayjanSharghi, ref cityId, new[] { "کشکسرای", "سهند", "سیس", "دوزدوزان", "تیمورلو" });
            Provinces.Add(azarbayjanSharghi);

            // آذربایجان غربی
            var azarbayjanGharbi = new Province { Id = provinceId++, Name = "آذربایجان غربی", Cities = new List<City>() };
            AddCities(azarbayjanGharbi, ref cityId, new[] { "تازه شهر", "نالوس", "ایواوغلی", "شاهین دژ", "گردکشانه" });
            Provinces.Add(azarbayjanGharbi);

            // اردبیل
            var ardabil = new Province { Id = provinceId++, Name = "اردبیل", Cities = new List<City>() };
            AddCities(ardabil, ref cityId, new[] { "پارس آباد", "فخراباد", "کلور", "نیر", "اردبیل" });
            Provinces.Add(ardabil);

            // اصفهان
            var isfahan = new Province { Id = provinceId++, Name = "اصفهان", Cities = new List<City>() };
            AddCities(isfahan, ref cityId, new[] { "گزبرخوار", "زیار", "زرین شهر", "گلشن", "پیربکران" });
            Provinces.Add(isfahan);

            // البرز
            var alborz = new Province { Id = provinceId++, Name = "البرز", Cities = new List<City>() };
            AddCities(alborz, ref cityId, new[] { "چهارباغ", "آسارا", "کرج", "فردیس" });
            Provinces.Add(alborz);

            // ایلام
            var ilam = new Province { Id = provinceId++, Name = "ایلام", Cities = new List<City>() };
            AddCities(ilam, ref cityId, new[] { "آبدانان", "شباب", "موسیان", "بدره", "ایلام", "ایوان" });
            Provinces.Add(ilam);

            // بوشهر
            var bushehr = new Province { Id = provinceId++, Name = "بوشهر", Cities = new List<City>() };
            AddCities(bushehr, ref cityId, new[] { "ریز", "برازجان", "بندرریگ", "اهرم", "دوراهک", "خورموج" });
            Provinces.Add(bushehr);

            // تهران
            var tehran = new Province { Id = provinceId++, Name = "تهران", Cities = new List<City>() };
            AddCities(tehran, ref cityId, new[] {
                "شاهدشهر", "پیشوا", "جوادآباد", "ارجمند", "ری", "نصیرشهر", "رودهن", "اندیشه",
                "نسیم شهر", "صباشهر", "ملارد", "تهران", "بومهن", "لواسان", "دماوند", "پردیس"
            });
            Provinces.Add(tehran);

            // چهارمحال و بختیاری
            var chaharmahal = new Province { Id = provinceId++, Name = "چهارمحال و بختیاری", Cities = new List<City>() };
            AddCities(chaharmahal, ref cityId, new[] { "وردنجان", "گوجان", "گهرو", "سورشجان", "سرخون", "شهرکرد", "منج" });
            Provinces.Add(chaharmahal);

            // خراسان جنوبی
            var khorasanJonubi = new Province { Id = provinceId++, Name = "خراسان جنوبی", Cities = new List<City>() };
            AddCities(khorasanJonubi, ref cityId, new[] { "اسلامیه", "شوسف", "قاین", "عشق آباد", "طبس مسینا", "ارسک" });
            Provinces.Add(khorasanJonubi);

            // خراسان رضوی
            var khorasanRazavi = new Province { Id = provinceId++, Name = "خراسان رضوی", Cities = new List<City>() };
            AddCities(khorasanRazavi, ref cityId, new[] {
                "بار", "نیل شهر", "جنگل", "درود", "رباط سنگ", "سلطان آباد", "فریمان", "گناباد"
            });
            Provinces.Add(khorasanRazavi);

            // خراسان شمالی
            var khorasanShomali = new Province { Id = provinceId++, Name = "خراسان شمالی", Cities = new List<City>() };
            AddCities(khorasanShomali, ref cityId, new[] {
                "چناران شهر", "راز", "پیش قلعه", "قوشخانه", "شوقان", "اسفراین", "گرمه", "قاضی",
                "شیروان", "حصارگرمخان", "آشخانه", "تیتکانلو", "جاجرم", "بجنورد", "درق", "آوا",
                "زیارت", "سنخواست", "صفی آباد", "ایور", "فاروج", "لوجلی"
            });
            Provinces.Add(khorasanShomali);

            // خوزستان
            var khuzestan = new Province { Id = provinceId++, Name = "خوزستان", Cities = new List<City>() };
            AddCities(khuzestan, ref cityId, new[] {
                "هفتگل", "بیدروبه", "شاوور", "حمزه", "گتوند", "شرافت", "مسجدسلیمان", "اندیمشک",
                "الوان", "سالند", "هویزه", "آزادی", "شوش", "دزفول"
            });
            Provinces.Add(khuzestan);

            // زنجان
            var zanjan = new Province { Id = provinceId++, Name = "زنجان", Cities = new List<City>() };
            AddCities(zanjan, ref cityId, new[] { "سجاس", "زرین رود", "آب بر", "ارمغانخانه", "کرسف" });
            Provinces.Add(zanjan);

            // سمنان
            var semnan = new Province { Id = provinceId++, Name = "سمنان", Cities = new List<City>() };
            AddCities(semnan, ref cityId, new[] { "ایوانکی", "مجن", "دامغان", "سرخه", "مهدی شهر", "شاهرود" });
            Provinces.Add(semnan);

            // سیستان و بلوچستان
            var sistan = new Province { Id = provinceId++, Name = "سیستان و بلوچستان", Cities = new List<City>() };
            AddCities(sistan, ref cityId, new[] { "محمدی", "شهرک علی اکبر", "بنجار", "گلمورتی", "نگور", "راسک", "بنت" });
            Provinces.Add(sistan);

            // فارس
            var fars = new Province { Id = provinceId++, Name = "فارس", Cities = new List<City>() };
            AddCities(fars, ref cityId, new[] {
                "کازرون", "کارزین (فتح آباد)", "فدامی", "خومه زار", "سلطان شهر", "فیروزآباد",
                "دبیران", "باب انار", "رامجرد", "سروستان", "قره بلاغ"
            });
            Provinces.Add(fars);

            // قزوین
            var qazvin = new Province { Id = provinceId++, Name = "قزوین", Cities = new List<City>() };
            AddCities(qazvin, ref cityId, new[] { "سگزآباد", "بیدستان", "کوهین", "رازمیان", "خرمدشت", "آبگرم", "شال", "شریفیه" });
            Provinces.Add(qazvin);

            // قم
            var qom = new Province { Id = provinceId++, Name = "قم", Cities = new List<City>() };
            AddCities(qom, ref cityId, new[] { "کهک", "قم", "سلفچگان", "جعفریه", "قنوات", "دستجرد" });
            Provinces.Add(qom);

            // کردستان
            var kordestan = new Province { Id = provinceId++, Name = "کردستان", Cities = new List<City>() };
            AddCities(kordestan, ref cityId, new[] { "قروه", "توپ آغاج", "سروآباد", "بویین سفلی", "زرینه", "دلبران", "سنندج", "یاسوکند" });
            Provinces.Add(kordestan);

            // کرمان
            var kerman = new Province { Id = provinceId++, Name = "کرمان", Cities = new List<City>() };
            AddCities(kerman, ref cityId, new[] { "کهنوج", "بلوک", "پاریز", "گنبکی", "زنگی آباد", "بم", "خانوک", "کیانشهر" });
            Provinces.Add(kerman);

            // کرمانشاه
            var kermanshah = new Province { Id = provinceId++, Name = "کرمانشاه", Cities = new List<City>() };
            AddCities(kermanshah, ref cityId, new[] { "سنقر", "شاهو", "بانوره", "تازه آباد", "هلشی", "جوانرود", "قصرشیرین", "نوسود", "کرند" });
            Provinces.Add(kermanshah);

            // کهگیلویه وبویراحمد
            var kohgiluyeh = new Province { Id = provinceId++, Name = "کهگیلویه وبویراحمد", Cities = new List<City>() };
            AddCities(kohgiluyeh, ref cityId, new[] { "گراب سفلی", "لنده", "سی سخت", "دهدشت", "یاسوج", "سرفاریاب", "دوگنبدان", "چیتاب" });
            Provinces.Add(kohgiluyeh);

            // گلستان
            var golestan = new Province { Id = provinceId++, Name = "گلستان", Cities = new List<City>() };
            AddCities(golestan, ref cityId, new[] { "سیمین شهر", "مزرعه", "رامیان", "فراغی", "گنبدکاووس", "کردکوی", "مراوه", "بندرترکمن", "نگین شهر", "آق قلا" });
            Provinces.Add(golestan);

            // گیلان
            var gilan = new Province { Id = provinceId++, Name = "گیلان", Cities = new List<City>() };
            AddCities(gilan, ref cityId, new[] { "منجیل", "شلمان", "خشکبیجار", "ماکلوان", "سنگر", "مرجقل", "رودبار", "کومله", "رشت", "ماسوله", "خمام", "ماسال" });
            Provinces.Add(gilan);

            // لرستان
            var lorestan = new Province { Id = provinceId++, Name = "لرستان", Cities = new List<City>() };
            AddCities(lorestan, ref cityId, new[] { "چالانچولان", "بیران شهر", "ویسیان", "شول آباد", "پلدختر", "کوهدشت", "هفت چشمه" });
            Provinces.Add(lorestan);

            // مازندران
            var mazandaran = new Province { Id = provinceId++, Name = "مازندران", Cities = new List<City>() };
            AddCities(mazandaran, ref cityId, new[] { "گلوگاه", "پل سفید", "دابودشت", "چالوس", "کیاسر", "بهنمیر", "تنکابن", "شیرود", "شیرگاه", "رویان", "زرگرمحله", "عباس اباد" });
            Provinces.Add(mazandaran);

            // مرکزی
            var markazi = new Province { Id = provinceId++, Name = "مرکزی", Cities = new List<City>() };
            AddCities(markazi, ref cityId, new[] { "آستانه", "خنجین", "نراق", "کمیجان", "آشتیان", "رازقان", "مهاجران" });
            Provinces.Add(markazi);

            // هرمزگان
            var hormozgan = new Province { Id = provinceId++, Name = "هرمزگان", Cities = new List<City>() };
            AddCities(hormozgan, ref cityId, new[] { "بیکاء", "تیرور", "گروک", "قشم", "کوشکنار", "کیش", "سرگز", "بندرعباس" });
            Provinces.Add(hormozgan);

            // همدان
            var hamedan = new Province { Id = provinceId++, Name = "همدان", Cities = new List<City>() };
            AddCities(hamedan, ref cityId, new[] { "زنگنه", "دمق", "سرکان", "آجین", "جورقان", "برزول", "فامنین", "سامن", "بهار", "فرسفج" });
            Provinces.Add(hamedan);

            // یزد
            var yazd = new Province { Id = provinceId++, Name = "یزد", Cities = new List<City>() };
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
            Users.Add(new User { Id = 1, FirstName = "علی", LastName = "احمدی", Username = "ali", Password = "123456", Email = "ali@test.com", Phone = "09121111111", ProvinceId = 6, CityId = 28 });
            Users.Add(new User { Id = 2, FirstName = "زهرا", LastName = "کریمی", Username = "zahra", Password = "123456", Email = "zahra@test.com", Phone = "09122222222", ProvinceId = 1, CityId = 3 });
            Users.Add(new User { Id = 3, FirstName = "محمد", LastName = "محمدی", Username = "mohammad", Password = "123456", Email = "mohammad@test.com", Phone = "09123333333", ProvinceId = 4, CityId = 19 });
            Users.Add(new User { Id = 4, FirstName = "فاطمه", LastName = "حسینی", Username = "fatemeh", Password = "123456", Email = "fatemeh@test.com", Phone = "09124444444", ProvinceId = 8, CityId = 47 });
            Users.Add(new User { Id = 5, FirstName = "رضا", LastName = "رضایی", Username = "reza", Password = "123456", Email = "reza@test.com", Phone = "09125555555", ProvinceId = 13, CityId = 102 });
            Users.Add(new User { Id = 6, FirstName = "سارا", LastName = "موسوی", Username = "sara", Password = "123456", Email = "sara@test.com", Phone = "09126666666", ProvinceId = 8, CityId = 43 });
            Users.Add(new User { Id = 7, FirstName = "احمد", LastName = "نوری", Username = "ahmad", Password = "123456", Email = "ahmad@test.com", Phone = "09127777777", ProvinceId = 24, CityId = 186 });
            Users.Add(new User { Id = 8, FirstName = "نرگس", LastName = "کاظمی", Username = "narges", Password = "123456", Email = "narges@test.com", Phone = "09128888888", ProvinceId = 8, CityId = 50 });
            Users.Add(new User { Id = 9, FirstName = "مهدی", LastName = "صادقی", Username = "mehdi", Password = "123456", Email = "mehdi@test.com", Phone = "09129999999", ProvinceId = 4, CityId = 221 });
            Users.Add(new User { Id = 10, FirstName = "لیلا", LastName = "جعفری", Username = "leila", Password = "123456", Email = "leila@test.com", Phone = "09120000000", ProvinceId = 8, CityId = 165 });
            Users.Add(new User { Id = 11, FirstName = "عباس", LastName = "عباسی", Username = "abas", Password = "123456", Email = "abas@test.com", Phone = "09120000000", ProvinceId = 2, CityId = 102 });
            Users.Add(new User { Id = 12, FirstName = "مهشید", LastName = "رحیمی", Username = "mahshid", Password = "123456", Email = "mahshid@test.com", Phone = "09120000000", ProvinceId = 8, CityId = 165 }); 
            Users.Add(new User { Id = 13, FirstName = "کاظم", LastName = "قاقی", Username = "ghaghi", Password = "123456", Email = "kazem@test.com", Phone = "09120000000", ProvinceId = 14, CityId = 285 }); 
            Users.Add(new User { Id = 14, FirstName = "حسین", LastName = "عباسی", Username = "hossein", Password = "123456", Email = "hossein@test.com", Phone = "09120111111", ProvinceId = 8, CityId = 165 }); 
            Users.Add(new User { Id = 15, FirstName = "مریم", LastName = "ابراهیمی", Username = "maryam", Password = "123456", Email = "maryam@test.com", Phone = "09120222222", ProvinceId = 4, CityId = 221 }); 
            Users.Add(new User { Id = 16, FirstName = "یوسف", LastName = "زمانی", Username = "yousef", Password = "123456", Email = "yousef@test.com", Phone = "09120333333", ProvinceId = 3, CityId = 109 }); 
            Users.Add(new User { Id = 17, FirstName = "الهام", LastName = "قاسمی", Username = "elham", Password = "123456", Email = "elham@test.com", Phone = "09120444444", ProvinceId = 8, CityId = 165 }); 
            Users.Add(new User { Id = 18, FirstName = "امیر", LastName = "رحیمی", Username = "amir", Password = "123456", Email = "amir@test.com", Phone = "09120555555", ProvinceId = 5, CityId = 237 }); 
            Users.Add(new User { Id = 19, FirstName = "سمیه", LastName = "کوهی", Username = "somayeh", Password = "123456", Email = "somayeh@test.com", Phone = "09120666666", ProvinceId = 8, CityId = 165 }); 
            Users.Add(new User { Id = 20, FirstName = "پویا", LastName = "رستمی", Username = "pooya", Password = "123456", Email = "pooya@test.com", Phone = "09120777777", ProvinceId = 7, CityId = 243 }); 
            Users.Add(new User { Id = 21, FirstName = "نگار", LastName = "دهقانی", Username = "negar", Password = "123456", Email = "negar@test.com", Phone = "09120888888", ProvinceId = 8, CityId = 165 }); 
            Users.Add(new User { Id = 22, FirstName = "سعید", LastName = "مرادی", Username = "saeed", Password = "123456", Email = "saeed@test.com", Phone = "09120999999", ProvinceId = 9, CityId = 244 }); 
            Users.Add(new User { Id = 23, FirstName = "پرستو", LastName = "خلیلی", Username = "parasto", Password = "123456", Email = "parasto@test.com", Phone = "09121010101", ProvinceId = 8, CityId = 165 }); 
            Users.Add(new User { Id = 24, FirstName = "کامران", LastName = "شریفی", Username = "kamran", Password = "123456", Email = "kamran@test.com", Phone = "09121121212", ProvinceId = 1, CityId = 45 }); 
            Users.Add(new User { Id = 25, FirstName = "رویا", LastName = "نجفی", Username = "roya", Password = "123456", Email = "roya@test.com", Phone = "09121232323", ProvinceId = 8, CityId = 165 });
            Users.Add(new User { Id = 1, FirstName = "علی", LastName = "احمدی", Username = "ali", Password = "123456", Email = "ali@test.com", Phone = "09121111111", ProvinceId = 6, CityId = 28 });
            Users.Add(new User { Id = 2, FirstName = "زهرا", LastName = "کریمی", Username = "zahra", Password = "123456", Email = "zahra@test.com", Phone = "09122222222", ProvinceId = 1, CityId = 3 });
            Users.Add(new User { Id = 3, FirstName = "محمد", LastName = "محمدی", Username = "mohammad", Password = "123456", Email = "mohammad@test.com", Phone = "09123333333", ProvinceId = 4, CityId = 19 });
            Users.Add(new User { Id = 4, FirstName = "فاطمه", LastName = "حسینی", Username = "fatemeh", Password = "123456", Email = "fatemeh@test.com", Phone = "09124444444", ProvinceId = 8, CityId = 47 });
            Users.Add(new User { Id = 5, FirstName = "رضا", LastName = "رضایی", Username = "reza", Password = "123456", Email = "reza@test.com", Phone = "09125555555", ProvinceId = 13, CityId = 102 });
            Users.Add(new User { Id = 6, FirstName = "سارا", LastName = "موسوی", Username = "sara", Password = "123456", Email = "sara@test.com", Phone = "09126666666", ProvinceId = 8, CityId = 43 });
            Users.Add(new User { Id = 7, FirstName = "احمد", LastName = "نوری", Username = "ahmad", Password = "123456", Email = "ahmad@test.com", Phone = "09127777777", ProvinceId = 24, CityId = 186 });
            Users.Add(new User { Id = 8, FirstName = "نرگس", LastName = "کاظمی", Username = "narges", Password = "123456", Email = "narges@test.com", Phone = "09128888888", ProvinceId = 8, CityId = 50 });
            Users.Add(new User { Id = 9, FirstName = "مهدی", LastName = "صادقی", Username = "mehdi", Password = "123456", Email = "mehdi@test.com", Phone = "09129999999", ProvinceId = 4, CityId = 221 });
            Users.Add(new User { Id = 10, FirstName = "لیلا", LastName = "جعفری", Username = "leila", Password = "123456", Email = "leila@test.com", Phone = "09120000000", ProvinceId = 8, CityId = 165 });
            Users.Add(new User { Id = 11, FirstName = "عباس", LastName = "عباسی", Username = "abas", Password = "123456", Email = "abas@test.com", Phone = "09120000000", ProvinceId = 2, CityId = 102 });
            Users.Add(new User { Id = 12, FirstName = "مهشید", LastName = "رحیمی", Username = "mahshid", Password = "123456", Email = "mahshid@test.com", Phone = "09120000000", ProvinceId = 8, CityId = 165 });
            Users.Add(new User { Id = 13, FirstName = "کاظم", LastName = "قاقی", Username = "ghaghi", Password = "123456", Email = "kazem@test.com", Phone = "09120000000", ProvinceId = 14, CityId = 285 });
            Users.Add(new User { Id = 14, FirstName = "حسین", LastName = "عباسی", Username = "hossein", Password = "123456", Email = "hossein@test.com", Phone = "09120111111", ProvinceId = 8, CityId = 165 });
            Users.Add(new User { Id = 15, FirstName = "مریم", LastName = "ابراهیمی", Username = "maryam", Password = "123456", Email = "maryam@test.com", Phone = "09120222222", ProvinceId = 4, CityId = 221 });
            Users.Add(new User { Id = 16, FirstName = "یوسف", LastName = "زمانی", Username = "yousef", Password = "123456", Email = "yousef@test.com", Phone = "09120333333", ProvinceId = 3, CityId = 109 });
            Users.Add(new User { Id = 17, FirstName = "الهام", LastName = "قاسمی", Username = "elham", Password = "123456", Email = "elham@test.com", Phone = "09120444444", ProvinceId = 8, CityId = 165 });
            Users.Add(new User { Id = 18, FirstName = "امیر", LastName = "رحیمی", Username = "amir", Password = "123456", Email = "amir@test.com", Phone = "09120555555", ProvinceId = 5, CityId = 237 });
            Users.Add(new User { Id = 19, FirstName = "سمیه", LastName = "کوهی", Username = "somayeh", Password = "123456", Email = "somayeh@test.com", Phone = "09120666666", ProvinceId = 8, CityId = 165 });
            Users.Add(new User { Id = 20, FirstName = "پویا", LastName = "رستمی", Username = "pooya", Password = "123456", Email = "pooya@test.com", Phone = "09120777777", ProvinceId = 7, CityId = 243 });
            Users.Add(new User { Id = 21, FirstName = "نگار", LastName = "دهقانی", Username = "negar", Password = "123456", Email = "negar@test.com", Phone = "09120888888", ProvinceId = 8, CityId = 165 });
            Users.Add(new User { Id = 22, FirstName = "سعید", LastName = "مرادی", Username = "saeed", Password = "123456", Email = "saeed@test.com", Phone = "09120999999", ProvinceId = 9, CityId = 244 });
            Users.Add(new User { Id = 23, FirstName = "پرستو", LastName = "خلیلی", Username = "parasto", Password = "123456", Email = "parasto@test.com", Phone = "09121010101", ProvinceId = 8, CityId = 165 });
            Users.Add(new User { Id = 24, FirstName = "کامران", LastName = "شریفی", Username = "kamran", Password = "123456", Email = "kamran@test.com", Phone = "09121121212", ProvinceId = 1, CityId = 45 });
            Users.Add(new User { Id = 25, FirstName = "رویا", LastName = "نجفی", Username = "roya", Password = "123456", Email = "roya@test.com", Phone = "09121232323", ProvinceId = 8, CityId = 165 });
        }
    }
}