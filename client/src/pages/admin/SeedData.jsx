import React, { useState } from 'react';
import { Card, Button, FormGroup, Input } from '../../components/common/FormComponents';
import { FiDatabase, FiTrash2, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';

const SeedData = () => {
  const [jobCount, setJobCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSeedJobs = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const response = await api.post('/api/seed/jobs', { count: jobCount });

      if (response.data.success) {
        setMessage(`✅ ${response.data.message}`);
        setMessageType('success');
      }
    } catch (error) {
      console.error('Error seeding jobs:', error);
      setMessage(`❌ ${error.response?.data?.message || 'Failed to seed jobs'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearJobs = async () => {
    if (!window.confirm('⚠️ WARNING: This will delete ALL jobs from the database. Are you sure?')) {
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await api.delete('/api/seed/jobs');

      if (response.data.success) {
        setMessage(`✅ ${response.data.message}`);
        setMessageType('success');
      }
    } catch (error) {
      console.error('Error clearing jobs:', error);
      setMessage(`❌ ${error.response?.data?.message || 'Failed to clear jobs'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seed Data</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate fake data for testing and development purposes
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg border ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' 
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
          }`}>
            <div className="flex items-center">
              {messageType === 'success' ? (
                <FiCheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <FiAlertTriangle className="h-5 w-5 mr-2" />
              )}
              <p>{message}</p>
            </div>
          </div>
        )}

        {/* Seed Jobs Card */}
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FiDatabase className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Seed Jobs
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generate fake job postings with realistic data
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FormGroup label="Number of Jobs">
                <Input
                  type="number"
                  value={jobCount}
                  onChange={(e) => setJobCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="50"
                  placeholder="Enter number of jobs (1-50)"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Maximum 50 jobs per request
                </p>
              </FormGroup>

              <Button
                variant="primary"
                onClick={handleSeedJobs}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Seeding Jobs...
                  </div>
                ) : (
                  <>
                    <FiDatabase className="mr-2" />
                    Seed {jobCount} Jobs
                  </>
                )}
              </Button>
            </div>

            {/* Info Box */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Generated Data Includes:
              </h3>
              <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                <li>• Random job titles (Software Engineer, Developer, etc.)</li>
                <li>• Random company names and locations</li>
                <li>• Job types (Full-time, Part-time, Contract)</li>
                <li>• Salary ranges ($40k - $170k)</li>
                <li>• Experience requirements (0-15 years)</li>
                <li>• Application deadlines (next 3 months)</li>
                <li>• Detailed descriptions and requirements</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Clear Jobs Card */}
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FiTrash2 className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Clear All Jobs
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Delete all jobs from the database
                </p>
              </div>
            </div>

            <Button
              variant="danger"
              onClick={handleClearJobs}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Clearing Jobs...
                </div>
              ) : (
                <>
                  <FiTrash2 className="mr-2" />
                  Clear All Jobs
                </>
              )}
            </Button>

            {/* Warning Box */}
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start">
                <FiAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
                    ⚠️ Warning
                  </h3>
                  <p className="text-xs text-red-800 dark:text-red-400">
                    This action will permanently delete ALL jobs from the database. 
                    This cannot be undone. Use with extreme caution!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Usage Guide */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Usage Guide
            </h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Testing Workflow:</h3>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Seed 5-10 jobs for basic testing</li>
                  <li>Test pagination with 20-50 jobs</li>
                  <li>Clear database before fresh seed if needed</li>
                  <li>Jobs are automatically linked to your admin account</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Quick Actions:</h3>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li><strong>Small Test:</strong> 5 jobs - Quick testing</li>
                  <li><strong>Medium Test:</strong> 20 jobs - Pagination testing</li>
                  <li><strong>Large Test:</strong> 50 jobs - Load testing</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  💡 <strong>Tip:</strong> Use the dashboard to view your seeded jobs and test the 
                  application functionality with realistic data.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SeedData;
