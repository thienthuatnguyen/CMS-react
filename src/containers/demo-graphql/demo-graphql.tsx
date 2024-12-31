import React, { useEffect, useState } from "react";
import { http } from "../../services/httpConfig";
import Paper from "@mui/material/Paper";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function DemoGraphqlPage() {
  const [listPost, setListPost] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    let params = {
      query: `
      query{
       posts{
         title,
         content, 
         author {
          id,
          name
         }
       }
     }
  `
    }
    http.get('/graphql/', { params: params }).then(res => {
      setListPost(res.data.data.posts);
    });
  }


  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="left">Content</TableCell>
              <TableCell align="left">Author</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listPost.map((row: any) => (
              <TableRow
                key={row.title}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="left">{row.content}</TableCell>
                <TableCell align="left">{row.author.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}

export default DemoGraphqlPage;