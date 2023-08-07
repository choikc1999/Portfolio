const User = require("../model/User");

// join id checking
exports.index = (req, res) => {
    res.render("login");    
}

exports.checkDuplicateId = (req, res) => {
    const { id } = req.body;
    User.checkDuplicateId(id, function (err, isDuplicate) {
        if (err) {
            console.error("Error checking duplicate ID", err);
            return res.status(500).json({ error: "Error checking duplicate ID" });
        }
        res.json({ isDuplicate: isDuplicate });
    });
};

exports.check_duplicate_id = (req, res) => {
    const id = req.body.id;

    User.checkDuplicateId(id, function (err, isDuplicate) {
        if (err) {
            console.error("Error checking duplicate ID in MySQL", err);
            return res.status(500).json({ error: "Error checking duplicate ID in the database" });
        }

        if (isDuplicate) {
            return res.status(200).json({ isDuplicate: true });
        } else {
            return res.status(200).json({ isDuplicate: false });
        }
    });
};

// user information save
exports.post_user = (req, res) => {
    const userData = req.body;

    User.insert(userData, function (err, result) {
        if (err) {
            console.error("UserController - Error inserting user data", err);
            if (err === "Duplicate ID") {
                return res.status(400).json({ error: "Duplicate ID. Please choose a different ID." });
            } else {
                console.error("Error saving user data to MySQL", err);
                return res.status(500).json({ error: "Error saving user data to the database" });
            }
        }
        return res.status(200).json({ id: result.id });
    });
};