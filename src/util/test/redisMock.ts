jest.mock('redis', () => {
    return {
        createClient: () => ({
            on: jest.fn(),
            connect: jest.fn(),
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn()
        })
    }
});
