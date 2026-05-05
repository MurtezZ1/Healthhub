using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ReactApp1.Server.Data.Models;

namespace ReactApp1.Server.Services
{
    public class MedicalLogService
    {
        private readonly IMongoCollection<MedicalLog> _medicalLogsCollection;

        public MedicalLogService(IMongoClient mongoClient)
        {
            var mongoDatabase = mongoClient.GetDatabase("HealthhubNoSQL");
            _medicalLogsCollection = mongoDatabase.GetCollection<MedicalLog>("MedicalLogs");
        }

        public async Task<List<MedicalLog>> GetAsync() =>
            await _medicalLogsCollection.Find(_ => true).ToListAsync();

        public async Task<MedicalLog?> GetAsync(string id) =>
            await _medicalLogsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(MedicalLog newLog) =>
            await _medicalLogsCollection.InsertOneAsync(newLog);

        public async Task UpdateAsync(string id, MedicalLog updatedLog) =>
            await _medicalLogsCollection.ReplaceOneAsync(x => x.Id == id, updatedLog);

        public async Task RemoveAsync(string id) =>
            await _medicalLogsCollection.DeleteOneAsync(x => x.Id == id);
    }
}
