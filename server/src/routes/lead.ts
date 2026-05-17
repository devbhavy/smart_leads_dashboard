import express, { type Request, type Response } from "express";
import { Lead } from "../lib/mongoose.js";
import { leadInputSchema } from "../lib/zod.js";
import { authMiddleware } from "../middlewares/middleware.js";

const leadRouter = express.Router();

leadRouter.use(authMiddleware);

leadRouter.get("/", async (req: any, res: Response) => {
    try {
        const { status, source, search, sort, page = 1, limit = 10 } = req.query;

        const filter: Record<string, any> = {};

        if (status) filter.status = status;
        if (source) filter.source = source;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const sortOrder = sort === "oldest" ? 1 : -1;
        const total = await Lead.countDocuments(filter);
        const leads = await Lead.find(filter)
            .sort({ createdAt: sortOrder })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        res.status(200).json({
            data: leads,
            meta: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

leadRouter.get("/export", async (req: any, res: Response) => {
    try {
        const leads = await Lead.find({ createdBy: req.user._id });

        const csv = [
            ["Name", "Email", "Status", "Source", "Created At"].join(","),
            ...leads.map(lead => [
                lead.name,
                lead.email,
                lead.status,
                lead.source,
                new Date(lead.createdAt).toLocaleDateString()
            ].join(","))
        ].join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

leadRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ msg: "Lead not found" });
        res.status(200).json({ data: lead });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

leadRouter.post("/", async (req: any, res: Response) => {
    try {
        const parsed = leadInputSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ msg: parsed.error });

        const lead = await Lead.create({
            ...parsed.data,
            createdBy: req.user._id
        });

        res.status(201).json({ data: lead });
    } catch (error) {
        
        res.status(500).json({ msg: "Server error" });
    }
});

leadRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const parsed = leadInputSchema.partial().safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ msg: parsed.error });

        const lead = await Lead.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
        if (!lead) return res.status(404).json({ msg: "Lead not found" });

        res.status(200).json({ data: lead });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

leadRouter.delete("/:id", async (req: any, res: Response) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Only admins can delete leads" });
        }

        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ msg: "Lead not found" });

        res.status(200).json({ msg: "Lead deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

export { leadRouter };