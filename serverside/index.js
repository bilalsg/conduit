import express from "express"
import mysql from "mysql"
import cors from "cors";
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"
import jwt from 'jsonwebtoken'; // Import jsonwebtoken module

const app = express();
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.options('/login', cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(cookieParser());

const port = 8080;
const db = mysql.createConnection({
    host: 'localhost',
    user: 'bilalsegaa',
    password: 'x7WZhmKKhdBK5Y49',
    database: 'bddproject'
  });
db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to MySQL database');
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



app.get('/', (req, res) => {
  res.send('Hello, World! This is the homepage.');
});
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        throw err;
      }
      res.json(results);
    });
})

app.get('/card', (req, res) => {
  db.query('SELECT * FROM customcards', (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
})

app.post('/users', async (req, res) => {
  const { Firstname, Lastname, Email, Password } = req.body;

  if (!Firstname || !Lastname || !Email || !Password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(Password, 10); // Hash the password

    db.query(
      'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
      [Firstname, Lastname, Email, hashedPassword],
      (error, results) => {
        if (error) {
          console.error('Error inserting data into the database:', error);
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
          } else {
            return res.status(500).json({ error: 'Error inserting data into the database' });
          }
        } else {
          console.log('Data inserted successfully.');
          return res.status(200).json({ message: 'Data inserted successfully.' });
        }
      }
    );
  } catch (error) {
    console.error('Error hashing the password:', error);
    return res.status(500).json({ error: 'Error hashing the password' });
  }
});


app.use(bodyParser.json());



app.post('/tails', (req, res) => {
  const { tail, name, URL,userId } = req.body;
  console.log(userId)
  if (!tail  || !URL) {
    return res.status(400).json({ error: 'Please provide tail, name, and URL.' });
  }

  const insertQuery = 'INSERT INTO tails (tail, name, URL,user_id) VALUES (?, ?, ?,?)';
  const values = [tail, name, URL,userId];
  
  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Error inserting data into the database.' });
    }
    console.log('Data inserted:', result);
    res.status(200).json({ message: 'Data inserted successfully.' });
  });
});


app.get('/tails', (req, res) => {
  const query = `
  SELECT tails.*, users.profile_picture,users.firstname,users.lastname
  FROM tails
  JOIN users ON tails.user_id = users.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});


app.get('/search', (req, res) => {
  const { word } = req.query;

  const queryString = 'SELECT firstname,lastname,profile_picture FROM users WHERE firstname LIKE ? OR lastname LIKE ?';
  const parameter = [`%${word}%`, `%${word}%`];

  db.query(queryString, parameter, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});

app.post('/login', (req, res) => {
  const { Email, Password } = req.body;
  console.log(Email,Password)
  if (!Email || !Password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const queryString = 'SELECT * FROM users WHERE email = ?';

  db.query(queryString, [Email], async (err, rows) => {
    try {
      if (err) {
        throw new Error('Error occurred while querying the database.');
      }
      
      if (rows.length === 0) {
        throw new Error('Invalid email or password.');
      }

      const user = rows[0];

      const hashedPassword = user.password;
      const userId = user.id;

      const passwordMatch = await bcrypt.compare(Password, hashedPassword);

      if (!passwordMatch) {
        throw new Error('Invalid email or password.');
      }

      // Create a JWT token with the user ID
      const token = jwt.sign({ userId }, 'your_secret_key_here', { expiresIn: '1h' });
      const {password,...others}=user
      
      res.cookie('accessToken', token, { httpOnly: true }).status(200).json(others);
      
     
    } catch (error) {
      console.error('Error occurred while logging in:', error);
      res.status(401).json({ error: 'Invalid email or password.' });
    }
  });
});
app.post('/logout', (req, res) => {
  // Clear the authentication token on the client side
  // For example, by setting an expired date on the cookie if you're using cookies
  res.cookie('token', '', { expires: new Date(0) });

 

  res.status(200).json({ message: 'Logout successful' });
});

app.put('/update-cover', async (req, res) => {
  const { userId, coverPicture } = req.body;
  console.log(userId, coverPicture);

  const updateQuery = `
    UPDATE users
    SET cover_picture = ?
    WHERE id = ?
  `;

  db.query(updateQuery, [coverPicture, userId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (results.affectedRows > 0) {
      res.json({ success: true, message: 'Cover picture updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
});
app.put('/update-profile-picture', async (req, res) => {
  const { userId, profilePicture } = req.body;
  console.log(userId, profilePicture);

  const updateQuery = `
    UPDATE users
    SET profile_picture = ?
    WHERE id = ?
  `;

  db.query(updateQuery, [profilePicture, userId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (results.affectedRows > 0) {
      res.json({ success: true, message: 'profile picture updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
});
app.put('/update-profile-desc', async (req, res) => {
  const { userId, ProfileDesc } = req.body;
  console.log(userId, ProfileDesc);

  const updateQuery = `
    UPDATE users
    SET description = ?
    WHERE id = ?
  `;

  db.query(updateQuery, [ProfileDesc, userId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (results.affectedRows > 0) {
      res.json({ success: true, message: 'profile picture updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
});
app.put('/update-personal-information', async (req, res) => {
  const { userId, Firstname, Lastname } = req.body;
  console.log(userId, Firstname, Lastname);

  const updateQuery = `
    UPDATE users
    SET firstname = ?, lastname = ?
    WHERE id = ?
  `;

  db.query(updateQuery, [Firstname, Lastname, userId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (results.affectedRows > 0) {
      res.json({ success: true, message: 'Personal information updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
});
app.put('/save', (req, res) => {
  const { userId, imageUrl} = req.body;
 
  const insertQuery = `
    INSERT INTO user_galleries (user_id, image_url)
    VALUES (?, ?)
  `;

  db.query(insertQuery, [userId, imageUrl], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.json({ success: true, message: 'URL inserted successfully' });
    }
  });
});
app.get('/save/:userId', (req, res) => {
  const { userId } = req.params;

  const query = 'SELECT * FROM user_galleries WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});
app.delete('/delete/:gallery_id', (req, res) => {
  const { gallery_id } = req.params;
  console.log(gallery_id);

  db.query('DELETE FROM user_galleries WHERE gallery_id = ?', [gallery_id], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
  });
});
app.post('/follow', (req, res) => {
  const { userId, followerUserId } = req.body;
  console.log(userId, followerUserId)
  db.query('INSERT INTO followers (user_id, follower_user_id) VALUES (?, ?)', [userId, followerUserId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.json({ success: true, message: 'User followed successfully' });
    }
  });
});
app.get('/follow/:userId', (req, res) => {
  const { userId } = req.params;
  console.log(userId)
  const query = 'SELECT follower_user_id FROM followers WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});
app.get('/search/:follower_user_id', (req, res) => {
  const { follower_user_id } = req.params; 
  
  const queryString = 'SELECT firstname,lastname,profile_picture FROM users WHERE id=?';
  const parameter = [follower_user_id];

  db.query(queryString, parameter, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});


app.get('/skills', (req, res) => {
  const query = 'SELECT DISTINCT skill_name FROM SkillsAndSteps';
  
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching skills:', err);
          return res.status(500).json({ error: 'Database query failed' });
      }
      
      // Send unique skill names as a response
      const skills = results.map(row => row.skill_name);
      res.json({ skills });
  });
});
app.get('/steps', (req, res) => {
  const { skill } = req.query;  // Using req.query to get the skill from the query parameter

  if (!skill) {
    return res.status(400).json({ error: 'Skill parameter is required' });
  }

  const query = 'SELECT step_description FROM SkillsAndSteps WHERE skill_name = ?';

  db.query(query, [skill], (err, results) => {
    if (err) {
      console.error('Error fetching steps:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No steps found for this skill' });
    }

    const steps = results.map(row => row.step_description);
    res.json({ skill, steps });
  });
});


app.post('/skilladd', (req, res) => {
  const { user_id, skill_name } = req.body;

  if (!user_id || !skill_name) {
    return res.status(400).json({ success: false, message: 'user_id and skill_name are required' });
  }

  const query = 'INSERT INTO UserSkills (user_id, skill_name) VALUES (?, ?)';

  db.query(query, [user_id, skill_name], (err, result) => {
    if (err) {
      console.error('Error adding skill:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    res.status(201).json({ success: true, message: 'Skill added successfully' });
  });
});
app.post('/skillsshow', (req, res) => {
  const { userId } = req.body; // Extract userId from request body

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  // SQL query to fetch skills based on user_id
  const query = 'SELECT id, user_id, skill_name FROM userskills WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching skills:', err);
      return res.status(500).json({ message: 'Failed to fetch skills' });
    }

    // Respond with the fetched skills
    res.json({ skills: results });
  });
});


app.post('/addcomment', (req, res) => {
  const { commentText, userId, tailId } = req.body;

  // Ensure all required fields are provided
  if (!commentText || !userId || !tailId) {
    return res.status(400).json({ message: 'commentText, userId, and tailId are required' });
  }

  // SQL query to insert a new comment into the database
  const insertQuery = 'INSERT INTO comments (comment_text, user_id, tail_id) VALUES (?, ?, ?)';

  db.query(insertQuery, [commentText, userId, tailId], (err, result) => {
    if (err) {
      console.error('Error inserting comment:', err);
      return res.status(500).json({ message: 'Failed to add comment' });
    }

    // Respond with success message
    res.status(200).json({ message: 'Comment added successfully', commentId: result.insertId });
  });
});


app.get('/getComments/:tailId', (req, res) => {
  const { tailId } = req.params;

  // Ensure tailId is provided
  if (!tailId) {
    return res.status(400).json({ message: 'tailId is required' });
  }

  // SQL query to fetch comments for the given tailId
  const query = 'SELECT comment_text, user_id, created_at FROM comments WHERE tail_id = ? ORDER BY created_at DESC';

  db.query(query, [tailId], (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      return res.status(500).json({ message: 'Failed to fetch comments' });
    }

    res.status(200).json({ comments: results });
  });
});

app.get('/getAllComments', (req, res) => {
  // SQL query to fetch comments with additional user info (firstname, lastname, email, password, profile_picture, description, cover_picture)
  const query = `
    SELECT c.tail_id, c.comment_text, c.user_id, c.created_at,
           u.id AS user_id, u.firstname, u.lastname, u.email, u.password, 
           u.profile_picture, u.description, u.cover_picture
    FROM comments c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.tail_id, c.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      return res.status(500).json({ message: 'Failed to fetch comments' });
    }

    // Group comments by tail_id
    const groupedComments = results.reduce((acc, comment) => {
      const { tail_id, comment_text, user_id, created_at, firstname, lastname, email, password, profile_picture, description, cover_picture } = comment;
      if (!acc[tail_id]) {
        acc[tail_id] = [];
      }
      acc[tail_id].push({
        comment_text,
        user_id,
        created_at,
        firstname,
        lastname,
        email,
        password,  // You might not want to expose this in the API for security reasons
        profile_picture,
        description,
        cover_picture
      });
      return acc;
    }, {});

    res.status(200).json({ comments: groupedComments });
  });
});
