import Category from '../models/category.js';

export const createCategory = async (req, res) => {
    const { name, description,icon} = req.body;

    try {
        if (name.length <= 3) {
            return res.status(400).json({ message: "Category name must be greater than 3 characters." });
        }
        if(name&&description&&icon){
        const newCategory = new Category({
            name,
            description,
            icon

        });
        const category = await newCategory.save();

        res.status(200).json(category);
    }else{
        return res.status(400).json({ message: "All category fields needed" });

    }

       

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
