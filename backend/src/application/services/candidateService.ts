import { PrismaClient } from '@prisma/client';
import { validateCandidateData } from '../validator';

// Instancia por defecto para uso normal
const defaultPrisma = new PrismaClient();

export const addCandidate = async (candidateData: any, prisma: PrismaClient = defaultPrisma) => {
    try {
        console.log('Validating candidate data:', candidateData);
        validateCandidateData(candidateData); // Validar los datos del candidato
        console.log('Validation passed');
    } catch (error: any) {
        console.log('Validation failed:', error.message);
        throw new Error(error);
    }

    try {
        console.log('Creating candidate with Prisma...');
        // Crear el candidato con todas sus relaciones en una sola transacción
        const savedCandidate = await prisma.candidate.create({
            data: {
                firstName: candidateData.firstName,
                lastName: candidateData.lastName,
                email: candidateData.email,
                phone: candidateData.phone,
                address: candidateData.address,
                educations: candidateData.educations ? {
                    create: candidateData.educations.map((edu: any) => ({
                        institution: edu.institution,
                        title: edu.title,
                        startDate: edu.startDate,
                        endDate: edu.endDate
                    }))
                } : undefined,
                workExperiences: candidateData.workExperiences ? {
                    create: candidateData.workExperiences.map((exp: any) => ({
                        company: exp.company,
                        position: exp.position,
                        description: exp.description,
                        startDate: exp.startDate,
                        endDate: exp.endDate
                    }))
                } : undefined,
                resumes: candidateData.cv ? {
                    create: [{
                        filePath: candidateData.cv.filePath,
                        fileType: candidateData.cv.fileType,
                        uploadDate: new Date()
                    }]
                } : undefined
            },
            include: {
                educations: true,
                workExperiences: true,
                resumes: true
            }
        });

        console.log('Candidate created successfully:', savedCandidate);
        return savedCandidate;
    } catch (error: any) {
        console.log('Error creating candidate:', error);
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('The email already exists in the database');
        } else {
            throw error;
        }
    }
};