const typeDefs = `#graphql

    type Product {
        id: ID!
        name: String!
        price: Float!
        category: String!
        image: String!
        stock: Int!
    }

    type User {
        id: ID!
        name: String!
        email: String!
    }

    input CreateProductInput {
        name: String!
        price: Float!
        category: String!
        image: String
        stock: Int!
    }

    input UpdateProductInput {
        name: String
        price: Float
        category: String
        image: String
        stock: Int
    }

    input RegisterUserInput {
        name: String!
        email: String!
        password: String!
    }

    input LoginUserInput {
        email: String!
        password: String!
    }

    type CartItem {
        product: Product!
        quantity: Int!
    }

    type Cart {
        id: ID!
        user: User!
        items: [CartItem!]!
        totalItems: Int!
        subtotal: Float!
    }

    input AddToCartInput {
        productId: ID!
        quantity: Int!
    }

    input UpdateCartItemInput {
        productId: ID!
        quantity: Int!
    }

    type OrderItem {
        product: Product!
        quantity: Int!
        price: Float!
    }

    type Order {
        id: ID!
        user: User!
        items: [OrderItem!]!
        totalAmount: Float!
        status: String!
        createdAt: String!
    }
        
    type Query {
        products: [Product!]!
        product(id: ID!): Product
        users: [User!]
        user(id: ID!): User
        currentUser: User
        myCart: Cart
        orders: [Order!]!
        order(id: ID!): Order
    }

    type Mutation {
        createProduct(input: CreateProductInput!): Product!
        updateProduct(
            id: ID!
            input: UpdateProductInput!
        ): Product!
        deleteProduct(id: ID!): Product!

        registerUser(input: RegisterUserInput!): User!
        loginUser(input: LoginUserInput!): User!
        logoutUser: Boolean!

        addToCart(input: AddToCartInput!): Cart!
        updateCartItem(input: UpdateCartItemInput!): Cart!
        removeFromCart(productId: ID!): Cart!
        clearCart: Cart!

        createOrder: Order!
    }
`;

export default typeDefs;
