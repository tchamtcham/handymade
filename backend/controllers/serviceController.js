const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Private
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user.id })
      .populate('providerId', 'name email')
      .lean();
      
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private
const createService = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    
    const service = new Service({
      providerId: req.user.id,
      title,
      description,
      price,
      category
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Verify user owns the service
    if (service.providerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.price = price || service.price;
    service.category = category || service.category;

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Verify user owns the service
    if (service.providerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await service.remove();
    res.json({ message: 'Service removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};