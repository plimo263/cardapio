import React, { useState, useMemo } from "react";
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
  TableSortLabel,
  TablePagination,
  TextField,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Select from "react-select";
import { EditOutlined, DeleteOutlined, FilterList } from "@mui/icons-material";

function descendingComparator(a, b, orderBy) {
  const va = a[orderBy];
  const vb = b[orderBy];
  if (va === undefined || va === null) return 1;
  if (vb === undefined || vb === null) return -1;
  if (vb < va) return -1;
  if (vb > va) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const Tabela = ({
  columns = [],
  rows = [],
  loading = false,
  onEdit,
  onDelete,
  actions = true,
}) => {
  // normaliza `rows` para sempre trabalhar com um array
  const rowsArray = useMemo(() => {
    if (!rows) return [];
    if (Array.isArray(rows)) return rows;
    if (rows.data && Array.isArray(rows.data)) return rows.data;
    if (rows.items && Array.isArray(rows.items)) return rows.items;
    if (rows.categorias && Array.isArray(rows.categorias))
      return rows.categorias;
    // fallback: tenta extrair valores do objeto
    try {
      return Object.values(rows);
    } catch (e) {
      return [];
    }
  }, [rows]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(
    columns.length ? columns[0].field || "" : ""
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [tempFilters, setTempFilters] = useState({});

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(0);
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rowsArray.filter((r) => {
      // global search
      let matchesQuery = false;
      if (!q) matchesQuery = true;
      else {
        // search across defined column fields; fallback to all fields
        for (const c of columns) {
          if (!c.field) continue;
          const v = r[c.field];
          if (
            v !== undefined &&
            v !== null &&
            String(v).toLowerCase().includes(q)
          ) {
            matchesQuery = true;
            break;
          }
        }
        if (!matchesQuery) {
          for (const k of Object.keys(r)) {
            const v = r[k];
            if (
              v !== undefined &&
              v !== null &&
              String(v).toLowerCase().includes(q)
            ) {
              matchesQuery = true;
              break;
            }
          }
        }
      }
      if (!matchesQuery) return false;

      // advanced filters (AND across columns)
      for (const key of Object.keys(filters)) {
        const vals = filters[key];
        if (!vals || vals.length === 0) continue;
        const val = r[key];
        if (Array.isArray(val)) {
          const has = val.some((x) => vals.includes(x));
          if (!has) return false;
        } else {
          if (!vals.includes(val)) return false;
        }
      }

      return true;
    });
  }, [rowsArray, query, columns, filters]);

  // compute available options per column
  const columnOptions = useMemo(() => {
    const map = {};
    for (const c of columns) {
      if (!c.field) continue;
      const set = new Set();
      for (const r of rowsArray) {
        const v = r[c.field];
        if (v === undefined || v === null) continue;
        if (Array.isArray(v)) {
          for (const x of v) set.add(x);
        } else {
          set.add(v);
        }
      }
      map[c.field] = Array.from(set);
    }
    return map;
  }, [rowsArray, columns]);

  const sorted = useMemo(() => {
    if (!orderBy) return filtered;
    // only sort if orderBy exists in row
    const comparator = getComparator(order, orderBy);
    const stabilized = filtered.map((el, index) => [el, index]);
    stabilized.sort((a, b) => {
      const comp = comparator(a[0], b[0]);
      if (comp !== 0) return comp;
      return a[1] - b[1];
    });
    return stabilized.map((el) => el[0]);
  }, [filtered, order, orderBy]);

  const paged = useMemo(() => {
    if (rowsPerPage === -1) return sorted;
    const start = page * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page, rowsPerPage]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper>
      <Toolbar sx={{ px: 2, py: 1 }}>
        <Box
          sx={{ display: "flex", gap: 1, width: "100%", alignItems: "center" }}
        >
          <TextField
            size="small"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Esc") {
                setQuery("");
              }
            }}
            fullWidth
            sx={{ width: "100%" }}
            inputProps={{ id: "search" }}
          />
          <IconButton
            aria-label="Filtro avançado"
            onClick={() => {
              setTempFilters(filters);
              setAdvancedOpen(true);
            }}
          >
            <FilterList />
          </IconButton>
        </Box>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((c) => (
              <TableCell
                key={c.field || c.label}
                sortDirection={orderBy === c.field ? order : false}
              >
                {c.field ? (
                  <TableSortLabel
                    active={orderBy === c.field}
                    direction={orderBy === c.field ? order : "asc"}
                    onClick={() => handleRequestSort(c.field)}
                  >
                    {c.label}
                  </TableSortLabel>
                ) : (
                  c.label
                )}
              </TableCell>
            ))}
            {actions && <TableCell>Ações</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {paged.map((row) => (
            <TableRow key={row.id}>
              {columns.map((c) => {
                const content = c.render
                  ? c.render(row)
                  : c.field
                  ? row[c.field]
                  : null;
                return (
                  <TableCell key={c.field || c.label}>{content}</TableCell>
                );
              })}
              {actions && (
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => onEdit && onEdit(row)}
                  >
                    <EditOutlined />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete && onDelete(row.id)}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 50, { label: "Todos", value: -1 }]}
        component="div"
        count={sorted.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={(e) => handleChangeRowsPerPage(e)}
      />
      <Dialog
        open={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filtro avançado</DialogTitle>
        <DialogContent>
          {columns
            .filter((c) => c.field)
            .map((c) => {
              const options = (columnOptions[c.field] || []).map((opt) => ({
                value: opt,
                label:
                  typeof opt === "boolean"
                    ? opt
                      ? "Sim"
                      : "Não"
                    : String(opt),
              }));
              const value = (tempFilters[c.field] || []).map((v) => ({
                value: v,
                label: String(v),
              }));
              return (
                <Box key={c.field} sx={{ mt: 2 }}>
                  <Box sx={{ mb: 1, fontSize: 13, color: "text.secondary" }}>
                    {c.label}
                  </Box>
                  <Select
                    isMulti
                    options={options}
                    value={options.filter((o) =>
                      (tempFilters[c.field] || []).includes(o.value)
                    )}
                    onChange={(selected) =>
                      setTempFilters({
                        ...tempFilters,
                        [c.field]: selected ? selected.map((s) => s.value) : [],
                      })
                    }
                  />
                </Box>
              );
            })}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setTempFilters({});
            }}
          >
            Limpar
          </Button>
          <Button onClick={() => setAdvancedOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              setFilters(tempFilters);
              setAdvancedOpen(false);
              setPage(0);
            }}
            variant="contained"
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Tabela;
