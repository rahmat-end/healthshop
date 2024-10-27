import { Repository } from "typeorm"
import { Medicine } from "../entities/Medicine"
import { AppDataSource } from "../data-source"
import { Request, Response } from "express"
import { medicineSchema } from "../utils/MedicineValidator"
import axios from "axios"
import * as dotenv from "dotenv"

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_URL = "https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1/accesstoken?grant_type=client_credentials";
const API_URL = "https://api-satusehat-stg.dto.kemkes.go.id/kfa-v2/products/all?page=1&size=50&product_type=farmasi";

async function fetchAccessToken(): Promise<string | null> {
    try {
        const response = await axios.post(
            TOKEN_URL,
            new URLSearchParams({
                client_id: CLIENT_ID!,
                client_secret: CLIENT_SECRET!
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error);
        return null;
    }
}

async function fetchMedicinesData(accessToken: string): Promise<any | null> {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data.items.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            const faultString = error.response.data?.fault?.faultstring;
            if (faultString === "Invalid access token" || faultString === "Access Token expired") {
                return "INVALID_TOKEN";
            }
        }
        console.error("Error fetching medicines data:", error);
        return null;
    }
}

export default new class MedicineServices {
    private readonly MedicineRepository: Repository<Medicine> = AppDataSource.getRepository(Medicine)
    async medicines(req: Request, res: Response): Promise<Response> {
        try {
            let accessToken = await fetchAccessToken();
            if (!accessToken) {
                return res.status(500).json({ message: "Failed to obtain access token" });
            }

            let medicinesAPI = await fetchMedicinesData(accessToken);
            if (medicinesAPI === "INVALID_TOKEN") {
                // Refresh token and retry if token is invalid or expired
                accessToken = await fetchAccessToken();
                if (!accessToken) {
                    return res.status(500).json({ message: "Failed to re-obtain access token" });
                }
                medicinesAPI = await fetchMedicinesData(accessToken);
            }

            if (!medicinesAPI) {
                return res.status(500).json({ message: "Failed to fetch medicines data" });
            }

            return res.status(200).json({
                status: "success",
                data: medicinesAPI,
                message: "Successfully! Record has been fetched",
            });
        } catch (err) {
            return res.status(500).json({ message: "Something error while fetching all medicine" });
        }
    }

    async find(req: Request, res: Response): Promise<Response> {
        try {
          const medicines = await this.MedicineRepository.find({ 
            order: { kfa_code: "ASC" }
          })
          
          return res.status(200).json({
            status: "success",
            data: medicines,
            message: "Successfully! All record has been fetched"
          })
        } catch (err) {
          return res.status(500).json({ message: "Something error while finding all medicines"})
        }
    }

    async add(req: Request, res: Response): Promise<Response> {
        try {
            const body = req.body

            const { error, value } = medicineSchema.validate(body)
            if(error) return res.status(200).json({ message: error.message })

            const obj = this.MedicineRepository.create({
                kfa_code: value.kfa_code,
                name: value.name,
                image: value.image || null,
                fix_price: value.fix_price,
                description: value.description || null,
                user: value.user
            })

            const medicine = await this.MedicineRepository.save(obj)
            return res.status(200).json({
                status: "success",
                data: medicine,
                message: "Successfully! Record has been added"
            })
        } catch (err) {
            return res.status(500).json({ message: "Something error while inserting data medicine"})
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
          const body = req.body
    
          const { error, value } = medicineSchema.validate(body)
          if(error) return res.status(200).json({ message: error.message })
          
          const obj = this.MedicineRepository.create({
            name: value.name,
            image: value.image || null,
            fix_price: value.fix_price,
            description: value.description || null,
            user: value.user,
            updated_at: new Date
          })
    
          await this.MedicineRepository.update(JSON.parse(req.params.id), obj)

          const medicine = await this.MedicineRepository.findOne({ where: { kfa_code: JSON.parse(req.params.id) } })

          return res.status(200).json({
            status: "success",
            data: medicine,
            message: "Successfully! Record has been updated"
          })
        } catch (err) {
          return res.status(500).json({ message: "Something error while updating data medicine"})
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
          const medicine = await this.MedicineRepository.delete(JSON.parse(req.params.id))

          return res.status(200).json({
            status: "success",
            data: medicine,
            message: "Successfully! Record has been deleted"
          })
        } catch (err) {
          return res.status(500).json({ message: "Something error while deleting data user"})
        }
    }
}