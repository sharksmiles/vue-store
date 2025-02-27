
DROP DATABASE IF EXISTS storeDB;
CREATE DATABASE storeDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE storeDB;

-- 创建用户表
DROP TABLE IF EXISTS users;
CREATE TABLE users(
  user_id int primary key auto_increment,
  userName char(40) not null unique,
  password char(40) not null,
  userPhoneNumber char(11) null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- ALTER TABLE users MODIFY COLUMN userName char (40) not null unique;
-- ALTER TABLE users MODIFY COLUMN password char (40)  not null;
-- insert into users
-- values(null, 'admin', '123456', '100861001010000');

-- 创建轮播图表
DROP TABLE IF EXISTS carousel;
CREATE TABLE carousel(
  carousel_id int primary key auto_increment,
  imgPath char(50) not null,
  describes char(50) not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 创建商品分类表
DROP TABLE IF EXISTS category;
CREATE TABLE category(
  category_id int primary key auto_increment,
  category_name char(20) not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建商品表
DROP TABLE IF EXISTS product;
CREATE TABLE product(
  product_id int primary key auto_increment,
  product_name char(100) not null,
  category_id int not null,
  product_title char(30) not null,
  product_intro text not null,
  product_picture char(200),
  product_price double not null,
  product_selling_price double not null,
  product_num int not null,
  product_sales int not null,
  constraint FK_product_category foreign key (category_id) references category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建商品图片表
DROP TABLE IF EXISTS product_picture;
CREATE TABLE product_picture(
  id int primary key auto_increment,
  product_id int not null,
  product_picture char(200),
  intro text null,
  constraint FK_product_id foreign key (product_id) references product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建购物车表
DROP TABLE IF EXISTS shoppingCart;
CREATE TABLE shoppingCart(
  id int primary key auto_increment,
  user_id int not null,
  product_id int not null,
  num int not null,
  constraint FK_user_id foreign key (user_id) references users (user_id),
  constraint FK_shoppingCart_id foreign key (product_id) references product (product_id)
);

-- 创建订单表
DROP TABLE IF EXISTS orders;
CREATE TABLE orders(
  id int primary key auto_increment,
  order_id bigint not null,
  user_id int not null,
  product_id int not null,
  product_num int not null,
  product_price double not null,
  order_time bigint not null,
  constraint FK_order_user_id foreign key (user_id) references users (user_id),
  constraint FK_order_id foreign key (product_id) references product (product_id)
);

-- 创建收藏表
DROP TABLE IF EXISTS collect;
CREATE TABLE collect(
  id int primary key auto_increment,
  user_id int not null,
  product_id int not null,
  collect_time bigint not null,
  constraint FK_collect_user_id foreign key (user_id) references users (user_id),
  constraint FK_collect_id foreign key (product_id) references product (product_id)
);
