 import { Box, Container, TablePagination } from "@mui/material";
 import { useNavigate } from "react-router-dom";
 import { useCallback, useEffect, useState } from "react";
 import ConsumHeader from "./ConsumHeader";
 import ConsumTable from "./ConsumTable";
 import { getConsum } from "../../service/getConsum";
 import type { Consum } from "../../model/Consum";
 import ConsumFormDialog from "./ConsumFormDialog";
import ConsumDetailDialog from "./ConsumDetailDialog";
 
 const MainConsum = () => {
   const navigate = useNavigate();
 
   const [items, setItems] = useState<Consum[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [totalCount, setTotalCount] = useState(0);
   const [currentPage, setCurrentPage] = useState(0); // 0-based for MUI
   const pageSize = 10;
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [detail, setDetail] = useState<Consum | null>(null);
   const [search, setSearch] = useState<string | undefined>(undefined);
 
   // Load consum list
  useEffect(() => {
    setLoading(true);
    getConsum({ page: currentPage + 1, page_size: pageSize, search })
      .then(res => {
        const normalize = (arr: any[]): Consum[] => arr.map((raw: any) => {
          const lenderLabel: string = raw?.id_lender ?? '';
          const namePart = lenderLabel.includes('Lender:') ? lenderLabel.replace('Lender:', '').trim() : lenderLabel;
          const bracketIdx = namePart.lastIndexOf('(');
          const displayName = bracketIdx > 0 ? namePart.substring(0, bracketIdx).trim() : namePart;
          return {
            id: raw?.id ?? String(Math.random()),
            user: {
              id: raw?.id ?? '',
              names: displayName,
              surnames: '',
              email: '',
            },
            monitor: {
              id: raw?.id_monitor ?? '',
              username: raw?.id_monitor ?? '',
              email: '',
              first_name: raw?.id_monitor ?? '',
              last_name: '',
            },
            supplies: (raw?.supplies_detail ?? []).map((s: any) => ({
              id: s?.supply_code,
              name: s?.supply,
              quantity: s?.quantity,
            })),
            created_at: raw?.created_at ?? undefined,
          } as Consum;
        });

        if (Array.isArray(res)) {
          const mapped = normalize(res as any[]);
          setItems(mapped);
          setTotalCount(mapped.length);
        } else if ((res as any).results) {
          const r = res as { results: any[]; count: number };
          setItems(normalize(r.results));
          setTotalCount(r.count);
        } else {
          setItems([]);
          setTotalCount(0);
        }
        setError(null);
      })
      .catch(() => setError("Error al cargar consumos"))
      .finally(() => setLoading(false));
  }, [currentPage, pageSize, search]);

  const handleBack = useCallback(() => { navigate("/resources"); }, [navigate]);
  const handleAddNew = useCallback(() => setIsFormOpen(true), []);
  const handleFormClose = useCallback(() => setIsFormOpen(false), []);
  const handleFormSuccess = useCallback(() => {
    setIsFormOpen(false);
    setLoading(true);
    getConsum({ page: currentPage + 1, page_size: pageSize, search })
      .then(res => {
        const normalize = (arr: any[]): Consum[] => arr.map((raw: any) => {
          const lenderLabel: string = raw?.id_lender ?? '';
          const namePart = lenderLabel.includes('Lender:') ? lenderLabel.replace('Lender:', '').trim() : lenderLabel;
          const bracketIdx = namePart.lastIndexOf('(');
          const displayName = bracketIdx > 0 ? namePart.substring(0, bracketIdx).trim() : namePart;
          return {
            id: raw?.id ?? String(Math.random()),
            user: { id: raw?.id ?? '', names: displayName, surnames: '', email: '' },
            monitor: { id: raw?.id_monitor ?? '', username: raw?.id_monitor ?? '', email: '', first_name: raw?.id_monitor ?? '', last_name: '' },
            supplies: (raw?.supplies_detail ?? []).map((s: any) => ({ id: s?.supply_code, name: s?.supply, quantity: s?.quantity })),
            created_at: raw?.created_at ?? undefined,
          } as Consum;
        });
        if (Array.isArray(res)) {
          const mapped = normalize(res as any[]);
          setItems(mapped);
          setTotalCount(mapped.length);
        } else if ((res as any).results) {
          const r = res as { results: any[]; count: number };
          setItems(normalize(r.results));
          setTotalCount(r.count);
        } else {
          setItems([]);
          setTotalCount(0);
        }
        setError(null);
      })
      .catch(() => setError("Error al cargar consumos"))
      .finally(() => setLoading(false));
  }, [currentPage, pageSize, search]);

  const handleSearch = useCallback((term: string) => { setSearch(term); setCurrentPage(0); }, []);
  const handleClearSearch = useCallback(() => { setSearch(undefined); setCurrentPage(0); }, []);
  const handleChangePage = (_: unknown, newPage: number) => { setCurrentPage(newPage); };

  const handleViewDetail = useCallback((c: Consum) => setDetail(c), []);
  const handleCloseDetail = useCallback(() => setDetail(null), []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: "background.default", pb: 2, mb: 2 }}>
          <ConsumHeader
            onBack={handleBack}
            onAddNew={handleAddNew}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
            totalCount={totalCount}
          />
        </Box>

        <Box sx={{ maxHeight: "600px", overflow: "auto", border: "1px solid", borderColor: "grey.300", borderRadius: 2 }}>
          <ConsumTable
            items={items}
            loading={loading}
            error={error}
            onViewDetail={handleViewDetail}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <TablePagination
            component="div"
            count={totalCount}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[pageSize]}
            labelRowsPerPage="Por página"
          />
        </Box>

        <ConsumFormDialog open={isFormOpen} onClose={handleFormClose} onSuccess={handleFormSuccess} />

        <ConsumDetailDialog open={!!detail} detail={detail} onClose={handleCloseDetail} />
      </Box>
    </Container>
  );
};
 
 export default MainConsum;
