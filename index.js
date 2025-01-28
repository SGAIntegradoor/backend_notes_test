const app = require("express");
// const logger = require("./middleware/loggerMiddleWare");
const morgan = require("morgan");
const cors = require("cors");
const server = app();
server.use(app.json());

server.name = "API Notes";

server.use(morgan("dev"));
server.use(cors());

let notes = [
	{
		id: 1,
		content: "Nota nueva de hoy con GET",
		date: "2024-12-27T19:30:31.098Z",
		important: false,
		userId: 1,
	},
	{
		id: 2,
		content: "Nota nueva de hoy con POST",
		date: "2024-12-27T18:30:31.098Z",
		important: false,
		userId: 1,
	},
	{
		id: 3,
		content: "Nota nueva de hoy con PUT",
		date: "2024-12-27T17:30:31.098Z",
		important: true,
		userId: 1,
	},
];
server.get("/API/notes", (req, res) => {
	res.json(notes);
});

server.get("/", (req, res) => {
	res.send("<h1>API Notes</h1>");
});

server.get("/API/notes/:id", (req, res) => {
	const id = +req.params.id;
	// console.log(id)
	const note = notes.find((note) => note.id === id);
	if (note) {
		res.json(note);
	} else {
		res.status(404).send("Nota no encontrada");
	}
});

server.delete("/API/notes/:id", (req, res) => {
	const id = +req.params.id;
	const note = notes.find((note) => note.id === id);
	if (note) {
		notes = notes.filter((note) => note.id !== id);
		res.status(204).end();
	} else {
		res.status(404).send("Nota no encontrada");
	}
});

server.put("/API/notes/:id", (req, res) => {
	const id = +req.params.id;
	const noteIndex = notes.findIndex((note) => note.id === id);

	if (noteIndex !== -1) {
		const updatedNote = {
			...notes[noteIndex],
			content: req.body.content || notes[noteIndex].content,
			date: req.body.date || notes[noteIndex].date,
			important:
				req.body.important !== undefined
					? req.body.important
					: notes[noteIndex].important,
		};

		notes[noteIndex] = updatedNote;

		res.status(200).json(updatedNote);
	} else {
		res.status(404).send("Nota no encontrada");
	}
});

// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

server.post("/API/notes", (req, res) => {
	// console.log(req.body);
	const note = req.body;

	if (!note || !note.content) {
		return res.status(400).json({
			error: "note.content is missing",
		});
	}

	const ids = notes.map((note) => note.id);
	const maxId = Math.max(...ids);
	const newNote = {
		id: maxId + 1,
		content: note.content,
		date: new Date().toISOString(),
		important: note.important || false,
	};
	notes = [...notes, newNote];
	res.status(201).json(newNote);
});

server.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || err;
	console.error(err);
	res.status(status).send(message);
});

server.use((req, res) => {
	res.status(404).send("Not found"); // 404
});

let port = process.env.PORT || 3001;

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

module.exports = server;
