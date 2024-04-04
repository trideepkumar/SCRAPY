import Listing from "../models/Listing.js"

export const createList = async (req, res) => {
    try {
        const listing = await Listing.create(req.body)
         return res.status(200).json(listing)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error" });
    }

}

export const deleteList = async (req, res) => {
    console.log("deleting list")
    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json('List Deleted Successfully!');
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateList = async(req,res) =>{
    const list = await Listing.findById(req.params.id)
    if(!list){
        return res.status(404).json('List not found !')
    }
    if(req.user.id !== list.userRef){
        return res.status(401).json('You can update your Listing only!')
    }
    try{
         const updateList = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
         )
         res.status(200).json(updateList)
    }catch(err){
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getListing = async(req,res) =>{
    try{
        const listing = await Listing.findById(req.params.id)
        if(!listing){
            return res.status(404).json('List not found!')
        }
        res.status(200).json(listing)
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getListings = async (req, res) => {
    console.log("get all list");
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let type = req.query.type || 'all';
        let searchTerm = req.query.searchTerm || '';

        searchTerm = new RegExp(searchTerm, 'i');

        let query = {
            name: searchTerm, 
        };

        if (type !== 'all') {
            query.type = type;
        }

        const listings = await Listing.find(query)
            .sort({ createdAt: -1 }) 
            .limit(limit)
            .skip(startIndex);

        console.log("Listings Found:", listings);

        return res.status(200).json(listings);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

