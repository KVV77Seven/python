from flask import Flask, jsonify, request
from peewee import *
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с фронтенда

db = SqliteDatabase('products.db')

class BaseModel(Model):
    class Meta:
        database = db

class Brand(BaseModel):
    name = CharField()

class Product(BaseModel):
    name = CharField()
    description = TextField()
    price = FloatField()
    brand = ForeignKeyField(Brand, backref='products')


def initialize_db():
    db.connect()
    db.create_tables([Brand, Product], safe=True)
    if Brand.select().count() == 0:
        for i in range(1, 11):
            Brand.create(name=f'Brand {i}')
    if Product.select().count() == 0:
        brands = list(Brand.select())
        for i in range(1, 1001):
            Product.create(
                name=f'Product {i}',
                description=f'Description for product {i}',
                price=round(random.uniform(10.0, 100.0), 2),
                brand=random.choice(brands)
            )
    db.close()


@app.route('/products', methods=['GET'])
def get_products():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 100))
    products = Product.select().paginate(page, per_page)
    products_list = [{
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'brand': product.brand.name
    } for product in products]
    return jsonify(products_list)

@app.route('/brands', methods=['GET'])
def get_brands():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 100))
    brands = Brand.select().paginate(page, per_page)
    brands_list = [{
        'id': brand.id,
        'name': brand.name,
        'product_count': brand.products.count()
    } for brand in brands]
    return jsonify(brands_list)


if __name__ == '__main__':
    initialize_db()
    app.run(debug=True)

