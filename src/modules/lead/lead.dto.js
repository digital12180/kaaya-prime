// types/lead.types.ts
export const mapLeadResponseDto = (lead) => ({
    _id: lead._id?.toString(),
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    source: lead.source,
    page: lead.page,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
});
//# sourceMappingURL=lead.dto.js.map