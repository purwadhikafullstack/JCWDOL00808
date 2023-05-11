const { Sequelize } = require("../models");
const { Op } = require("sequelize");

const db = require("../models/index");
const admin = db.admins;
const OrderDetail = db.order_details;
const Product = db.products;
const Warehouse = db.warehouses;
const Order = db.orders;
const ProductCategory = db.product_categories;

//import utils function
const { getCurrentMonth, getCurrentWeek } = require("../utils/function");

module.exports = {
  getSalesReport: async (req, res) => {
    try {
      const {
        email,
        start_date,
        end_date,
        warehouse_filter,
        category_filter,
        product_filter,
        time_period = "weekly",
        // page = 0, // default page value is 0
        // limit = 10, // default limit is 10
      } = req.query;

      const [defaultWeekStart, defaultWeekEnd] = getCurrentWeek();
      const [defaultMonthStart, defaultMonthEnd] = getCurrentMonth();

      // Authenticate user
      const authenticatedAdmin = await admin.findOne({
        where: { email: email },
      });

      if (!authenticatedAdmin) {
        return res.status(401).json({ message: "Invalid Email" });
      }

      const startDate = req.query.start_date
        ? new Date(req.query.start_date)
        : time_period === "weekly"
        ? new Date(defaultWeekStart)
        : new Date(defaultMonthStart);
      const endDate = req.query.end_date
        ? new Date(req.query.end_date)
        : time_period === "weekly"
        ? new Date(defaultWeekEnd)
        : new Date(defaultMonthEnd);

      // const startDate = new Date(start_date);
      // const endDate = new Date(end_date);

      // Ensure endDate includes the whole day
      endDate.setDate(endDate.getDate() + 1);
      endDate.setMilliseconds(endDate.getMilliseconds() - 1);

      // Set up filters based on user role and query parameters
      let warehouseFilter;
      if (authenticatedAdmin.role === 1) {
        warehouseFilter = warehouse_filter ? { id: warehouse_filter } : {};
      } else {
        warehouseFilter = { admins_id: authenticatedAdmin.id };
      }

      const warehouseIds = await Warehouse.findAll({
        attributes: ["id"],
        where: { admins_id: authenticatedAdmin.id, is_deleted: 0 },
      });

      const warehouseIdArray = warehouseIds.map((warehouse) => warehouse.id);

      // Fetch sales data
      let whereCondition = {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      };

      if (product_filter) {
        whereCondition["products_id"] = parseInt(product_filter);
      }

      let productInclude = {
        model: Product,
        as: "product",
        attributes: ["id", "name", "product_categories_id"],
        include: {
          model: ProductCategory,
          as: "product_category",
          attributes: ["id", "name"],
        },
      };

      if (category_filter) {
        productInclude.where = {
          product_categories_id: parseInt(category_filter),
        };
      }

      let orderInclude = {
        model: Order,
        attributes: [],
        include: {
          model: Warehouse,
          attributes: [],
          as: "warehouse",
          where: {
            is_deleted: 0,
          },
        },
        where: {
          status: {
            [Op.or]: ["On process", "Shipped", "Order confirmed"],
          },
        },
      };

      if (authenticatedAdmin.role === 1 && warehouse_filter) {
        orderInclude.where = {
          $warehouses_id$: warehouseFilter.id,
          status: {
            [Op.or]: ["On process", "Shipped", "Order confirmed"],
          },
        };
      } else if (authenticatedAdmin.role !== 1) {
        orderInclude.where = {
          warehouses_id: {
            [Op.in]: warehouseIdArray,
          },
        };
      }

      // const offset = limit * page;

      let salesData = await OrderDetail.findAll({
        where: whereCondition,
        include: [productInclude, orderInclude],
        // limit: parseInt(limit), // Apply limit for pagination
        // offset: offset, // Apply the offset for pagination
      });
      // console.log("salesData:", salesData);

      const totalRows = await OrderDetail.count({
        where: whereCondition,
        include: [productInclude, orderInclude],
      });

      // const totalPage = Math.ceil(totalRows / limit);

      // Generate report
      const report = generateReport(salesData);

      // Send the report as a response
      res.status(200).json({
        report: report,
        // page: page,
        // limit: limit,
        // totalRows: totalRows,
        // totalPage: totalPage,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while generating the sales report",
      });
    }

    function generateReport(salesData) {
      const monthly = [];
      const weekly = [];

      for (const sale of salesData) {
        const month = sale.createdAt.toISOString().slice(0, 7);
        const week = `${sale.createdAt.getFullYear()}-W${getWeekNumber(
          sale.createdAt
        )}`;

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
        const categoryName = sale.product.product_category.name;
        const productID = sale.product.id;
        const productName = sale.product.name;

        const category = monthReport.categories.find(
          (c) => c.id === categoryID
        ) || { id: categoryID, name: categoryName, total: 0, quantity: 0 };
        const product = monthReport.products.find(
          (p) => p.id === productID
        ) || { id: productID, name: productName, total: 0, quantity: 0 };

        category.total += amount;
        category.quantity += sale.quantity;
        product.total += amount;
        product.quantity += sale.quantity;

        if (!monthReport.categories.includes(category)) {
          monthReport.categories.push(category);
        }

        if (!monthReport.products.includes(product)) {
          monthReport.products.push(product);
        }

        const weekCategory = weekReport.categories.find(
          (c) => c.id === categoryID
        ) || { id: categoryID, name: categoryName, total: 0, quantity: 0 };
        const weekProduct = weekReport.products.find(
          (p) => p.id === productID
        ) || { id: productID, name: productName, total: 0, quantity: 0 };

        weekCategory.total += amount;
        weekCategory.quantity += sale.quantity;
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
          categories: r.categories.map((c) => ({
            id: c.id,
            name: c.name,
            total: c.total.toFixed(2),
            quantity: c.quantity,
          })),
          products: r.products.map((p) => ({
            id: p.id,
            name: p.name,
            total: p.total.toFixed(2),
            quantity: p.quantity,
          })),
        }));

      return {
        monthly: formatReports(monthly),
        weekly: formatReports(weekly),
      };
    }

    function getWeekNumber(d) {
      // Add timezone offset for GMT+7
      d = new Date(d.getTime() + 25200000); // 7 hours in milliseconds

      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      return weekNo;
    }
  },
};
