-- CreateTable
CREATE TABLE "network_configs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "smartContractAppID" TEXT NOT NULL,

    CONSTRAINT "network_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "network_configs_name_key" ON "network_configs"("name");
