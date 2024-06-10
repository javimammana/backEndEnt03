import { productServices } from "../services/services.js";

class ProductController {

    async createProduct (req, res) {
        const newProduct = {
            ...req.body,
            img: req.body.img || "sinImg.png"
        };
        try {
            const product = await productServices.createProduct(newProduct);
            res.json(product);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async getProducts (req, res) {
        console.log("in Controller")
        try {
            const products = await productServices.getProducts();
            console.log("out Controller")
            res.json(products)
            return;
        } catch (error) {
            console.log(error)
            res.status(500).json({error: error.message});
        }
    }

    async getProductsPaginate (req, res) {
        try {
            const limit = req.query.limit || 10;
            const filtro = req.query.query ? {category: req.query.query} : {};
            const sort = req.query.sort ? {price: Number(req.query.sort)} : {};
            const page = req.query.page || 1;
            const products = await productServices.getProductsPaginate(filtro, {limit: limit, page: page, sort: sort});

            res.json({
                status:"success",
                payload: products.totalDocs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&&limit={{productos.limit}}&query={{query}}&sort={{sort}}` : null,
                nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&&limit={{productos.limit}}&query={{query}}&sort={{sort}}` : null,
            })
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async getProductById (req, res) {
        const { pid } = req.params;
        try {
            let product = await productServices.getProductById(pid);
            res.json(product); 

        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async deleteProduct (req, res) {
        const { pid } = req.params;
        try {
            await productServices.deleteProduct(pid);
            res.json ({message: "Producto eliminado"});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async updateProduct (req, res) {
        const { pid } = req.params;
        const updateProduct = req.body;
        try {
            const product = await productServices.updateProduct(pid, updateProduct);
            res.json(product);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async deleteProductRealTime (data) {
        try {
            await productServices.deleteProduct(data);
        } catch (error) {
            console.log(error)
            throw new Error ("(CONTROLLER) Error al borrar productosRealTime");
        }
    }

    async getProductsRealTime () {
        try {
            const products = await productServices.getProducts();
            return products;
        } catch (error) {
            console.log(error)
            throw new Error ("(CONTROLLER) Error al obtener productosRealTime");
        }
    }

    async createProductRealTime (data) {
        try {
            await productServices.createProduct(data);
            return "Producto creado"
        } catch (error) {
            console.log(error)
            throw new Error ("(CONTROLLER) Error al crear productosRealTime");
        }
    }
}

export default ProductController;