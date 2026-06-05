import service from "../Models/ServicesModel.js"

export const createService = async (req, res) =>{
    try {
        const Service = await service.create(req.body)
        if(!Service){
            return res.status(404).json({
                success: false,
                message: "Required data is missing"
            })
        }
        return res.status(201).json({
            success: true,
            service: Service
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const updateService = async (req, res) =>{
    try {
        const {id} = req.params
        const Service = await service.findByIdAndUpdate(id, req.body,{new: true, runValidatores: true})
        if(!Service){
            return res.status(404).json({
                success: false,
                message: "No data is found"
            })
        }
        return res.status(200).json({
            success: true,
            service: Service
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const findAllServices = async(req, res) =>{
    try {
        if(req.headers.accept === "text/event-stream"){
            res.setHeader("Content-Type", "text/event-stream")
            res.setHeader("Cache-Control", "no-cache")
            res.setHeader("Connection", "keep-alive")
            res.status(200)

            const checkService = await service.watch()
            checkService.on("change", async (change)=>{
                try {
                    const updatedData = await service.find()
                    let servicesLength = 0
                    res.write(`data: ${JSON.stringify({ service: updatedData, servicesLength: updatedData.length})}\n\n`)
                } catch (error) {
                    console.log(error);
                }
            })
            req.on ("close", ()=>{
                checkService.close()
                res.end()
            })
            return
        }

        const Services = await service.find()
        if(!Services || Services.length < 0){
            return res.status(404).json({
                success: false,
                message: "No data is found"
            })
        }
        const servicesLength = 0
        return res.status(200).json({
            success: true,
            service: Services,
            servicesLength: Services.length
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const findService = async(req, res) =>{
    try {
        const {id} = req.params
        const Service = await service.findById(id)
        if(!Service){
            return res.status(404).json({
                success: false,
                message: "No data is found"
            })
        }
        return res.status(200).json({
            success: true,
            service: Service,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const deleteService = async(req, res) =>{
    try {
        const {id} = req.params
        const Service = await service.findByIdAndDelete(id)
        if(!Service){
            return res.status(404).json({
                success: false,
                message: "No data is found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Data has been deleted"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}