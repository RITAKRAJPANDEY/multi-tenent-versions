const AppError = require("../errors/appError");
const { addTenantRepo,  addTenantEventRepo, viewTenantEventRepo } = require("../repositories/tenant.repo");
const { decodeCursor, encodeCursor } = require("../utils/buffer.util");
const { genRandomBytes, cryptoHash } = require("../utils/crypto.util");

exports.createTenantService = async ({ tenantname }) => {
    try {
        const apiKey = genRandomBytes();
        const apiKeyHash = cryptoHash(apiKey);
        const tenant = await addTenantRepo(tenantname, apiKeyHash);
        return { current_plan: tenant.plan, created_at: tenant.created_at, id: tenant.id, apiKey: apiKey };
    } catch (err) {
        if (err.code === '23505') {
            throw new AppError('tenant already exists', 409);
        }
        console.error(err);
    }
}

exports.addtenantEventService = async ({ payload, type, tenant_id }) => {
    try {
        const event = await addTenantEventRepo(tenant_id, type, payload);
        return { created_at: event.created_at };
    } catch (err) {
        console.error(err);
        throw new AppError('Unable to Add Event', 404)
    }
}

exports.viewTenantEventService = async (filters) => {

    const MAX_LIMIT = 10;
    const MIN_LIMIT = 5;
    const rawLimit = Number(filters.limit);
    const limit = Math.min(Math.max(rawLimit ?? MIN_LIMIT, MIN_LIMIT), MAX_LIMIT);// fix the limiter

    const shapedFilters = {
        type: filters.type ?? null,
        from: filters.from ?? null,
        to: filters.to ?? null,// shape other parameters
    }
    if (shapedFilters.to && shapedFilters.from) {
        const fromDate = new Date(shapedFilters.from);
        const toDate = new Date(shapedFilters.to);
        if (isNaN(fromDate) || isNaN(toDate)) {
            throw new AppError('From and To must be dates',400);
        }
        if (fromDate > toDate) {
            throw new AppError('From > To not allowed',400);
        }
    }  // check for wrong values from the client side 
    const decodedCursor = filters.cursor ? decodeCursor(filters.cursor) : null; // check 
    const data = await viewTenantEventRepo({
        tenant_id: filters.tenant_id,
        filters:shapedFilters,
        limit: limit + 1,// so that we get to know whether there are more rows of data or not
        cursor: decodedCursor
    });
    let newCursor = null;
    if (data.length > limit) {
        const last = data.pop();
        newCursor = encodeCursor({id:last.id, created_at:last.created_at});
    }
    return { data, newCursor };

}
