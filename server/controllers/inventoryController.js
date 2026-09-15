const { getDBStatus } = require('../config/db');
const BloodInventory = require('../models/BloodInventory');
const { memoryInventory } = require('../config/store');

// GET /api/inventory
exports.getInventory = async (req, res) => {
  try {
    if (getDBStatus()) {
      let inventory = await BloodInventory.find({});
      if (!inventory || inventory.length === 0) {
        // Auto-seed if empty
        const defaultGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const seedData = defaultGroups.map(bg => ({
          bloodGroup: bg,
          units: bg === 'O-' ? 0 : 10,
          lastUpdated: new Date()
        }));
        inventory = await BloodInventory.insertMany(seedData);
      }
      return res.json({ success: true, inventory });
    }

    // In-memory fallback
    return res.json({ success: true, inventory: memoryInventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/inventory/:bloodGroup (Admin)
exports.updateInventory = async (req, res) => {
  try {
    const { bloodGroup } = req.params;
    const { units, action } = req.body; // units can be absolute number, or action: 'add'/'subtract'

    const upperGroup = bloodGroup.toUpperCase();
    const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validGroups.includes(upperGroup)) {
      return res.status(400).json({ success: false, message: 'Invalid blood group' });
    }

    let newUnits = Number(units);
    
    if (getDBStatus()) {
      let item = await BloodInventory.findOne({ bloodGroup: upperGroup });
      if (!item) {
        item = new BloodInventory({ bloodGroup: upperGroup, units: 0 });
      }

      if (action === 'add') {
        item.units += Number(units || 1);
      } else if (action === 'subtract') {
        item.units = Math.max(0, item.units - Number(units || 1));
      } else {
        item.units = Math.max(0, newUnits);
      }

      item.lastUpdated = new Date();
      await item.save();

      return res.json({ success: true, message: `Inventory updated for ${upperGroup}`, item });
    }

    // In-memory update
    const item = memoryInventory.find(i => i.bloodGroup === upperGroup);
    if (item) {
      if (action === 'add') {
        item.units += Number(units || 1);
      } else if (action === 'subtract') {
        item.units = Math.max(0, item.units - Number(units || 1));
      } else {
        item.units = Math.max(0, newUnits);
      }
      item.lastUpdated = new Date();
      return res.json({ success: true, message: `Inventory updated for ${upperGroup}`, item });
    }

    return res.status(404).json({ success: false, message: 'Blood group not found in inventory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
