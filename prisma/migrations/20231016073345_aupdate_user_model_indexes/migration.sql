-- CreateIndex
CREATE INDEX "User_username_email_privyWallet_safeWallet_idx" ON "User"("username", "email", "privyWallet", "safeWallet");
