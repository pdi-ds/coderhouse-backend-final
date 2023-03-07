# Demo

[Railway](https://coderhouse-backend.up.railway.app/)

## Creation of tables and collections

It is not necessary in the case of Firebase

`DB_ENGINE=sqlite3 ts-node create-tables.ts`

The options available for `DB_ENGINE` are the same as for the application initialization case.

## Public Views

The following public views are available:

- `/info` - Displaying system and process information
- `/chat` - Messaging (chat) through socket
- `/login` - Access to login
- `/user-token` - Access to view user token
- `/signup` - Access to user registration
- `/logout` - Access to logout user

## Endpoints

**Endpoint authorization:**

- `POST: /api/auth` - Authorizes the user and gets an application token; expects a `json` in the request body: `{ email: string, password: string }`. The generated token can be used for endpoints marked with, for example, for product endpoints since there are no defined roles, so a registered user can also edit product information.

**Endpoint products:**

- `GET: /api/products` - Get all products
- `GET: /api/products/:id` - Get a product by ID
- `POST: /api/products` - Add products; expects a `json` in the request body: `{ name: string, price: number, thumbnail: PathLike }`
- `PUT: /api/products/:id` - Update a product by ID; expects a `json` in the request body: `{ name: string, price: number, thumbnail: PathLike }
- `DELETE: /api/products/:id` - Delete a product by ID

**Car endpoints:**

- `POST: /api/carts` - Create a new cart
- `GET: /api/carts/:id` - Get a cart by ID
- `DELETE: /api/carts/:id` - Deletes a cart by ID
- `GET: /api/carts/:id/products` - Gets a cart's products by ID
- `POST: /api/carts/:id/products` - Add products to a cart by ID; expects a `json` in the request body: `{ products: [{ id: string, amount: number }, ...] }`
- `DELETE: /api/carts/:id/products/:productId` - Deletes a product from the cart by cart ID and product

**Endpoint orders:**

- `POST: /api/orders/:id` - Create a new order from a cart (`:id` corresponds to the cart ID) \*
- `GET: /api/orders/:id` - Get an order by ID \*
- `GET: /api/ordeers` - Gets all orders for the logged in user (user id owning the sent `token`) \*

Endpoints marked with \* are only available to authenticated users who have obtained a `token`. To obtain a `token` the user can [register](http://localhost:PORT/signup), [log in](http://localhost:PORT/login) or obtain the `token` through the authorization endpoint of users (prior registration).
