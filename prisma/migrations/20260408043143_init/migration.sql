-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "googleId" TEXT,
    "printLayout" TEXT DEFAULT '1',
    "address" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "customer" TEXT NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,
    "due" DOUBLE PRECISION,
    "received" DOUBLE PRECISION NOT NULL,
    "paymentType" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "item_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_uid_key" ON "Invoice"("uid");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
