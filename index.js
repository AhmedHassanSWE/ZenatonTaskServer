const express = require('express');
const fs = require('fs');
const cors = require('cors')

const PORT = process.env.PORT || 8081;

const app = express();
app.use(cors());
app.use(express.json());

app.post("/track", (req, res) => {
   const { id, from = undefined, to = undefined } = req.body;
   if (!id || typeof from === "undefined" || typeof to === "undefined") return res.status(400).json({error: "Bad Request"});
   else return res.status(204).send(null);
});

app.get("/nav", (req, res) => {
    if(fs.existsSync("nav.json")) return res.json(JSON.parse(fs.readFileSync("nav.json", "utf8")));
    else return res.json([
        {id: 1, title: "Dashboard", target: "/"},
        {
            id: 2,
            title: "Job Applications",
            target: "/applications",
            children: [
                {id: 7, title: "John Doe", target: "/applications/john-doe"},
                {id: 10, title: "James Bond", target: "/applications/james-bond"},
                {id: 20, title: "Scarlett Johansson", target: "/applications/scarlett-johansson", visible: false},
            ],
        },
        {
            id: 3,
            title: "Companies",
            target: "/companies",
            visible: false,
            children: [
                {id: 8, title: "Tanqeeb", target: "/companies/1"},
                {id: 9, title: "Daftra", target: "/companies/2"},
                {id: 11, title: "TBD", target: "/companies/14"},
            ],
        },
        {
            id: 4,
            title: "Qualifications",
            children: [
                {id: 14, title: "Q1", target: "/q1"},
                {id: 15, title: "Q2", target: "/q2"},
            ],
        },
        {id: 5, title: "About", target: "/about"},
        {id: 6, title: "Contact", target: "/contact"},
    ]);
});

app.post("/nav", (req, res) => {
    const items = req.body;
    console.log(items);
    if(!(items instanceof Array)) return res.status(400).send("Bad Request");
    else {
        fs.writeFileSync("nav.json", JSON.stringify(items));
        return res.status(204).send(null);
    }
});

app.listen(PORT);