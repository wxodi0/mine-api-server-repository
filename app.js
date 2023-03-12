const express = require('express');
const db = require('./models');

const { Member } = db;

const app = express();

app.use(express.json());

app.get('/api/members', async (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMembers = await Member.findAll({
      where: { team },
    });
    res.send(teamMembers);
  } else {
    const members = await Member.findAll();
    res.send(members);
  }
});

app.get('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no member with the id!' });
  }
});

app.post('/api/members', async (req, res) => {
  const newMember = req.body;
  const member = Member.build(newMember);
  await member.save();
  console.log(`After: ${member.id}`);
  res.send(member);
});

// app.put('/api/members/:id', async (req,res) => {
//   const id = req.params.id;
//   const newInfo = req.body;
//   const result = await Member.update(newInfo,{where : {id}});
//   if(result[0]){
//     res.send({message : `${result[0]} row(s) affected`});
//   }else{
//     res.status(404).send({ message : 'there is no member with the id!'});
//   }
// });

app.put('/api/members/:id',async (req,res) => {
  const id = req.params.id;
  const newInfo = req.body;
  const member = await Member.findOne({where : {id}});
  Object.keys(newInfo).forEach((prop) => {
    member[prop] = newInfo[prop];
  });
  await member.save();
  res.send(member);
});

// app.delete('/api/members/:id', async (req,res) => {
//   const id = req.params.id;
//   const deletedCount = await Member.destroy({where : {id}}); //destroy:원하는 where 삭제
//   if(deletedCount){
//     res.send({message : `${deletedCount} row(s) deleted`});
//   }else {
//     res.status(404).send({ message : 'there is no member with the id!'});
//   }
// });
//-----------------------------------다른 방법
app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const member = await Member.findOne({ where: { id } });
  if(member){
    await Member.destroy({where :{id}});
    res.send({message : `${id} is deleted`});
  }else{
    res.status(404).send({message : 'There is no member with the id'});
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening...');
});
