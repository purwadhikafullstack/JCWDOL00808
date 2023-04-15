const { Sequelize } = require("../../models");
const { Op } = require("sequelize");

const db = require("../../models/index");
const admin = db.admins;
const OrderDetail = db.order_details;
const Product = db.products;
const Warehouse = db.warehouses;
const Order = db.orders;

module.exports = {
  getSalesReport: async (req, res) => {
    try {
      const { email, start_date, end_date, warehouse_filter, category_filter, product_filter } = req.query;

      const authenticatedAdmin = await admin.findOne({
        where: { email: email },
      });

      if (!authenticatedAdmin) {
        return res.status(401).json({ message: "Invalid Email" });
      }

      const warehouseFilter = authenticatedAdmin.role === "1" && warehouse_filter ? { id: warehouse_filter } : { admins_id: authenticatedAdmin.id };

      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      endDate.setDate(endDate.getDate() + 1);
      endDate.setMilliseconds(endDate.getMilliseconds() - 1);

      let whereCondition = {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      };

      if (product_filter) {
        whereCondition["products_id"] = parseInt(product_filter);
      }

      let salesData = await OrderDetail.findAll({
        where: whereCondition,
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "product_categories_id"],
          },
          {
            model: Order,
            attributes: [],
            include: {
              model: Warehouse,
              attributes: [],
              where: warehouseFilter,
            },
          },
        ],
      });

      console.log("Original sales data:", salesData);

      if (product_filter) {
        console.log("Product filter value:", parseInt(product_filter));
        salesData = salesData.filter((sale) => {
          if (sale.product) {
            console.log("Sale product ID:", sale.product.id);
            return sale.product.id == parseInt(product_filter);
          }
          return false;
        });
        console.log("Filtered sales data after product filter:", salesData);
      }

      const report = generateReport(salesData);

      res.status(200).json(report);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while generating the sales report" });
    }

    function generateReport(salesData) {
      const monthly = [];
      const weekly = [];

      for (const sale of salesData) {
        const month = sale.createdAt.toISOString().slice(0, 7);
        const week = `${sale.createdAt.getFullYear()}-W${getWeekNumber(sale.createdAt)}`;

        let monthReport = monthly.find((m) => m.timePeriod === month);
        if (!monthReport) {
          monthReport = {
            timePeriod: month,
            total: 0,
            totalQuantity: 0,
            categories: [],
            products: [],
          };
          monthly.push(monthReport);
        }

        let weekReport = weekly.find((w) => w.timePeriod === week);
        if (!weekReport) {
          weekReport = {
            timePeriod: week,
            total: 0,
            totalQuantity: 0,
            categories: [],
            products: [],
          };
          weekly.push(weekReport);
        }

        const amount = sale.quantity * sale.product_price;
        monthReport.total += amount;
        weekReport.total += amount;

        monthReport.totalQuantity += sale.quantity;
        weekReport.totalQuantity += sale.quantity;

        const categoryID = sale.product.product_categories_id;
        const productID = sale.product.id;
        const productName = sale.product.name;

        const category = monthReport.categories.find((c) => c.id === categoryID) || { id: categoryID, total: 0 };
        const product = monthReport.products.find((p) => p.id === productID) || { id: productID, name: productName, total: 0, quantity: 0 };

        category.total += amount;
        product.total += amount;
        product.quantity += sale.quantity;

        if (!monthReport.categories.includes(category)) {
          monthReport.categories.push(category);
        }

        if (!monthReport.products.includes(product)) {
          monthReport.products.push(product);
        }

        const weekCategory = weekReport.categories.find((c) => c.id === categoryID) || { id: categoryID, total: 0 };
        const weekProduct = weekReport.products.find((p) => p.id === productID) || { id: productID, name: productName, total: 0, quantity: 0 };

        weekCategory.total += amount;
        weekProduct.total += amount;
        weekProduct.quantity += sale.quantity;

        if (!weekReport.categories.includes(weekCategory)) {
          weekReport.categories.push(weekCategory);
        }

        if (!weekReport.products.includes(weekProduct)) {
          weekReport.products.push(weekProduct);
        }
      }

      const formatReports = (reports) =>
        reports.map((r) => ({
          ...r,
          total: r.total.toFixed(2),
          categories: r.categories.map((c) => ({ id: c.id, total: c.total.toFixed(2) })),
          products: r.products.map((p) => ({ id: p.id, name: p.name, total: p.total.toFixed(2), quantity: p.quantity })),
        }));

      return {
        monthly: formatReports(monthly),
        weekly: formatReports(weekly),
      };
    }

    function getWeekNumber(d) {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      return weekNo;
    }
  },
};
