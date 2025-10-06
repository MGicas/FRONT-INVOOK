import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { getInventoryOptions } from "../model";
import { useInventoryNavigation } from "../hooks";

const MainInventory = () => {
  const theme = useTheme();
  const { navigateToRoute } = useInventoryNavigation();  
  const inventoryOptions = getInventoryOptions();

  const handleNavigation = (route: string) => {
    navigateToRoute(route);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <InventoryIcon
            sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: theme.palette.primary.main,
              mb: 2,
              fontWeight: "bold",
            }}
          >
            Gestión de Inventario
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Selecciona el tipo de inventario que deseas gestionar
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 4,
            mb: 4,
          }}
        >
          {inventoryOptions.map((option) => (
            <Card
              key={option.title}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease-in-out",
                border: `2px solid transparent`,
                "&:hover": {
                  border: `2px solid ${option.color}`,
                  transform: "translateY(-8px)",
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 4 }}>
                <Box sx={{ mb: 3 }}>{option.icon(theme)}</Box>

                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ mb: 2, fontWeight: "bold", color: option.color }}
                >
                  {option.title}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  {option.description}
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "bold", color: "text.secondary" }}
                  >
                    Incluye:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {option.examples.map((example) => (
                      <Typography
                        key={example}
                        variant="caption"
                        sx={{
                          backgroundColor: option.color,
                          color: "white",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                        }}
                      >
                        {example}
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => handleNavigation(option.route)}
                  sx={{
                    backgroundColor: option.color,
                    "&:hover": {
                      backgroundColor: option.color,
                      filter: "brightness(0.9)",
                    },
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  Gestionar {option.title}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "rgba(25, 118, 210, 0.05)",
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 2, color: theme.palette.primary.main }}
          >
            ¿Necesitas ayuda?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Desde cada sección podrás registrar, consultar, editar y gestionar
            el inventario correspondiente. También podrás generar reportes y
            realizar préstamos de equipos.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Equipos:</strong> Items con seguimiento individual y control
            de préstamos
            <br />
            <strong>Suministros:</strong> Items consumibles con control de stock
            y consumo
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default MainInventory;
