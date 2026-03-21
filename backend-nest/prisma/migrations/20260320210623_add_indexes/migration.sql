-- CreateIndex
CREATE INDEX "accommodations_city_idx" ON "accommodations"("city");

-- CreateIndex
CREATE INDEX "accommodations_type_idx" ON "accommodations"("type");

-- CreateIndex
CREATE INDEX "accommodations_status_idx" ON "accommodations"("status");

-- CreateIndex
CREATE INDEX "accommodations_userId_idx" ON "accommodations"("userId");

-- CreateIndex
CREATE INDEX "accommodations_dailyRate_idx" ON "accommodations"("dailyRate");

-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");

-- CreateIndex
CREATE INDEX "bookings_accommodationId_idx" ON "bookings"("accommodationId");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");
