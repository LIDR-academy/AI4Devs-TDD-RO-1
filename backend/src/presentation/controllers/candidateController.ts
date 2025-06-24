import { Request, Response } from 'express';
import { addCandidate } from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

// Obtener todos los candidatos
export const getAllCandidates = async (req: Request, res: Response) => {
    try {
        const candidates = await req.prisma.candidate.findMany({
            include: {
                educations: true,
                workExperiences: true,
                resumes: true
            }
        });
        res.status(200).json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Error fetching candidates' });
    }
};

// Obtener candidato por ID
export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const candidate = await req.prisma.candidate.findUnique({
            where: { id },
            include: {
                educations: true,
                workExperiences: true,
                resumes: true
            }
        });
        
        if (candidate) {
            res.status(200).json(candidate);
        } else {
            res.status(404).json({ message: 'Candidate not found' });
        }
    } catch (error) {
        console.error('Error fetching candidate:', error);
        res.status(500).json({ message: 'Error fetching candidate' });
    }
};