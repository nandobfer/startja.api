import { PrismaClient } from "@prisma/client"
import { NewNota } from "../definitions/userOperations"

const prisma = new PrismaClient()

const include = { nature: true, products: true, property: true }

// Funções relacionadas as notas fiscais ⬇️

const list = async () => {
    return await prisma.notaFiscal.findMany()
}

const create = async (data: NewNota) => {
    return await prisma.notaFiscal.create({
        data: {
            emission: new Date().getTime().toString(),
            seriesNfe: data.seriesNfe,
            clientSupplier: data.clientSupplier,
            issuer: data.issuer,
            value: data.value,
            situation: data.situation,
            dateTime: new Date().getTime().toString(),
            paymentCondition: data.paymentCondition,
            paymentType: data.paymentType,
            freteType: data.freteType,
            vehiclePlates: data.vehiclePlates,
            vehicleUf: data.vehicleUf,
            shippingCompany: data.shippingCompany,
            productQnty: data.productQnty,
            productType: data.productType,
            bruteWeightKg: data.bruteWeightKg,
            liquidWeightKg: data.liquidWeightKg,
            natureId: data.nature.id,
            companyId: data.company.id,
            propertyId: data.property.id,
            products: {
                connect: data.products.map((product) => ({ id: product.id }))
            }
        },
        include
    })
}

export default { list, create, include }
