import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const UsersTable = ({ users = [], loading = false, onEdit, onDelete }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>Ativo</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.is_admin ? "Sim" : "Não"}</TableCell>
              <TableCell>
                {u.active ? (
                  <CheckCircle sx={{ color: "#2e7d32" }} titleAccess="Ativo" />
                ) : (
                  <Cancel sx={{ color: "#c62828" }} titleAccess="Inativo" />
                )}
              </TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => onEdit && onEdit(u)}>
                  <EditOutlined />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete && onDelete(u.id)}
                >
                  <DeleteOutlined />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default UsersTable;
