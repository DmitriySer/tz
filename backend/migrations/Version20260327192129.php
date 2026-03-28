<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260327192129 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create items table and insert test data';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                price INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ');

        $this->addSql('
            INSERT INTO items (name, price, created_at) VALUES
                (\'Акустическая гитара\', 250, NOW() - INTERVAL \'20 days\'),
                (\'Электрогитара\', 450, NOW() - INTERVAL \'19 days\'),
                (\'Бас-гитара\', 380, NOW() - INTERVAL \'18 days\'),
                (\'Укулеле\', 89, NOW() - INTERVAL \'17 days\'),
                (\'Электропианино\', 550, NOW() - INTERVAL \'16 days\'),
                (\'Синтезатор\', 420, NOW() - INTERVAL \'15 days\'),
                (\'Барабанная установка\', 800, NOW() - INTERVAL \'14 days\'),
                (\'Электронные барабаны\', 650, NOW() - INTERVAL \'13 days\'),
                (\'Саксофон\', 480, NOW() - INTERVAL \'12 days\'),
                (\'Труба\', 320, NOW() - INTERVAL \'11 days\'),
                (\'Скрипка\', 290, NOW() - INTERVAL \'10 days\'),
                (\'Виолончель\', 580, NOW() - INTERVAL \'9 days\'),
                (\'Флейта\', 180, NOW() - INTERVAL \'8 days\'),
                (\'Кларнет\', 220, NOW() - INTERVAL \'7 days\'),
                (\'Гармошка\', 45, NOW() - INTERVAL \'6 days\'),
                (\'Аккордеон\', 520, NOW() - INTERVAL \'5 days\'),
                (\'Балалайка\', 95, NOW() - INTERVAL \'4 days\'),
                (\'Домра\', 110, NOW() - INTERVAL \'3 days\'),
                (\'Гусли\', 140, NOW() - INTERVAL \'2 days\'),
                (\'Колокольчики\', 35, NOW() - INTERVAL \'1 day\')
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE IF EXISTS items');
    }
}
