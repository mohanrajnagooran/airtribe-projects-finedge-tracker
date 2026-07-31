const fs = require('fs/promises');
const path = require('path');

/**
 * Lightweight async JSON file persistence helper.
 * Each model gets its own store instance pointed at a specific file.
 */
class JsonStore {
  constructor(fileName) {
    this.filePath = path.join(__dirname, '..', 'data', fileName);
  }

  async readAll() {
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      return raw.trim() ? JSON.parse(raw) : [];
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  async writeAll(records) {
    await fs.writeFile(this.filePath, JSON.stringify(records, null, 2), 'utf-8');
  }

  async findById(id) {
    const records = await this.readAll();
    return records.find((r) => r.id === id) || null;
  }

  async insert(record) {
    const records = await this.readAll();
    records.push(record);
    await this.writeAll(records);
    return record;
  }

  async updateById(id, updates) {
    const records = await this.readAll();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return null;
    records[index] = { ...records[index], ...updates, id: records[index].id };
    await this.writeAll(records);
    return records[index];
  }

  async deleteById(id) {
    const records = await this.readAll();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return false;
    records.splice(index, 1);
    await this.writeAll(records);
    return true;
  }
}

module.exports = JsonStore;
