-- AlterTable
ALTER TABLE `Customer` ADD COLUMN `bairro` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `cep` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `complemento` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `inscricao_estadual` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `isento` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `numero` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `regime_tributario` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `rua` VARCHAR(191) NOT NULL DEFAULT '';
